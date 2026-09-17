import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import type { Project, Task, TaskStatus } from '@/types'
import { updateStatus } from '@/api/TaskAPI'
import { statusAccent } from '@/locales/en'
import { useT, useStatusLabels } from '@/hooks/useT'
import TaskCard from './TaskCard'
import { cn } from '@/utils/utils'

type TaskListProps = {
  tasks: Task[]
  canEdit: boolean
}

type BoardColumns = Record<TaskStatus, string[]>

const STATUSES: TaskStatus[] = [
  'pending',
  'onHold',
  'inProgress',
  'underReview',
  'completed',
]

const dropAnimation: DropAnimation = {
  duration: 250,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)',
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.5' },
    },
  }),
}

function buildColumns(tasks: Task[]): BoardColumns {
  const columns: BoardColumns = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
  }
  for (const task of tasks) {
    columns[task.status].push(task._id)
  }
  return columns
}

function findContainer(
  columns: BoardColumns,
  id: UniqueIdentifier,
): TaskStatus | undefined {
  const sid = id.toString()
  if (STATUSES.includes(sid as TaskStatus)) return sid as TaskStatus
  return STATUSES.find((status) => columns[status].includes(sid))
}

function flattenColumns(
  columns: BoardColumns,
  taskMap: Map<string, Task>,
): Task[] {
  return STATUSES.flatMap((status) =>
    columns[status]
      .map((id) => {
        const task = taskMap.get(id)
        return task ? { ...task, status } : null
      })
      .filter((t): t is Task => t !== null),
  )
}

function Column({
  status,
  taskIds,
  taskMap,
  canEdit,
  boardDragging,
  onAdd,
}: {
  status: TaskStatus
  taskIds: string[]
  taskMap: Map<string, Task>
  canEdit: boolean
  boardDragging: boolean
  onAdd?: () => void
}) {
  const t = useT()
  const statusLabels = useStatusLabels()
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex min-w-[272px] max-w-[300px] flex-1 flex-col 2xl:min-w-0">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn('h-2 w-2 rounded-full', statusAccent[status])} />
        <h3 className="text-sm font-medium text-muted">{statusLabels[status]}</h3>
        <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-muted">
          {taskIds.length}
        </span>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'relative flex min-h-[140px] flex-1 flex-col gap-3 rounded-xl p-1.5 transition-colors duration-200',
            isOver && boardDragging && 'bg-accent-soft/60',
          )}
        >
          {taskIds.length === 0 && (
            <div
              className={cn(
                'pointer-events-none absolute inset-1.5 flex items-center justify-center rounded-xl border border-dashed border-glass-border px-3 text-center text-xs text-muted transition-opacity duration-200',
                boardDragging ? 'opacity-40' : 'opacity-100',
              )}
            >
              {t('task.dropHere')}
            </div>
          )}

          {taskIds.map((id) => {
            const task = taskMap.get(id)
            if (!task) return null
            return (
              <TaskCard
                key={id}
                task={{ ...task, status }}
                canEdit={canEdit}
              />
            )
          })}

          {canEdit && onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="mt-1 inline-flex items-center gap-2 self-start rounded-lg px-2 py-1.5 text-sm font-medium text-ink transition hover:bg-mist"
            >
              <Plus className="h-4 w-4" />
              {t('task.add')}
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const t = useT()
  const params = useParams()
  const projectId = params.projectId!
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [columns, setColumns] = useState<BoardColumns>(() => buildColumns(tasks))
  const [clonedColumns, setClonedColumns] = useState<BoardColumns | null>(null)
  const columnsRef = useRef(columns)
  columnsRef.current = columns

  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

  const taskMap = useMemo(() => {
    const map = new Map<string, Task>()
    for (const task of tasks) map.set(task._id, task)
    return map
  }, [tasks])

  useEffect(() => {
    if (activeId) return
    setColumns(buildColumns(tasks))
  }, [tasks, activeId])

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [columns])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)

      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (STATUSES.includes(overId.toString() as TaskStatus)) {
          const containerItems = columnsRef.current[overId as TaskStatus]
          if (containerItems.length > 0) {
            overId =
              closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                  (container) =>
                    container.id !== overId &&
                    containerItems.includes(container.id.toString()),
                ),
              })[0]?.id ?? overId
          }
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId],
  )

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error: Error) => {
      toast.error(error.message)
      setColumns(buildColumns(tasks))
    },
    onSuccess: (data) => {
      toast.success(data ?? t('task.statusUpdated'))
    },
  })

  const activeTask = activeId ? taskMap.get(activeId) : null

  const persistBoard = (
    next: BoardColumns,
    movedTaskId: string,
    nextStatus: TaskStatus,
  ) => {
    const previous = taskMap.get(movedTaskId)
    const statusChanged = previous && previous.status !== nextStatus

    queryClient.setQueryData(
      ['project', projectId],
      (prevData: Project | undefined) => {
        if (!prevData) return prevData
        return {
          ...prevData,
          tasks: flattenColumns(next, taskMap),
        }
      },
    )

    if (statusChanged) {
      mutate({ projectId, taskId: movedTaskId, status: nextStatus })
    }
  }

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id.toString())
    setClonedColumns(columnsRef.current)
    lastOverId.current = e.active.id
  }

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    const overId = over?.id
    if (overId == null) return

    const activeContainer = findContainer(columnsRef.current, active.id)
    const overContainer = findContainer(columnsRef.current, overId)
    if (!activeContainer || !overContainer) return
    if (activeContainer === overContainer) return

    setColumns((prev) => {
      const activeItems = prev[activeContainer]
      const overItems = prev[overContainer]
      const activeIndex = activeItems.indexOf(active.id.toString())
      if (activeIndex === -1) return prev

      const overIndex = overItems.indexOf(overId.toString())

      let newIndex: number
      if (STATUSES.includes(overId.toString() as TaskStatus)) {
        newIndex = overItems.length + 1
      } else {
        const isBelowOverItem =
          !!over &&
          !!active.rect.current.translated &&
          active.rect.current.translated.top >
            over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      recentlyMovedToNewContainer.current = true

      return {
        ...prev,
        [activeContainer]: activeItems.filter((id) => id !== active.id.toString()),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex),
        ],
      }
    })
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    const currentColumns = columnsRef.current
    const snapshot = clonedColumns
    setClonedColumns(null)

    if (!over) {
      if (snapshot) setColumns(snapshot)
      requestAnimationFrame(() => setActiveId(null))
      return
    }

    const activeContainer = findContainer(currentColumns, active.id)
    const overContainer = findContainer(currentColumns, over.id)
    if (!activeContainer || !overContainer) {
      if (snapshot) setColumns(snapshot)
      requestAnimationFrame(() => setActiveId(null))
      return
    }

    let next = currentColumns

    if (activeContainer === overContainer) {
      const activeIndex = currentColumns[activeContainer].indexOf(
        active.id.toString(),
      )
      const overIndex = STATUSES.includes(over.id.toString() as TaskStatus)
        ? activeIndex
        : currentColumns[overContainer].indexOf(over.id.toString())

      if (overIndex >= 0 && activeIndex >= 0 && activeIndex !== overIndex) {
        next = {
          ...currentColumns,
          [overContainer]: arrayMove(
            currentColumns[overContainer],
            activeIndex,
            overIndex,
          ),
        }
        setColumns(next)
      }
    }

    persistBoard(next, active.id.toString(), overContainer)
    requestAnimationFrame(() => setActiveId(null))
  }

  const handleDragCancel = () => {
    if (clonedColumns) setColumns(clonedColumns)
    requestAnimationFrame(() => setActiveId(null))
    setClonedColumns(null)
  }

  return (
    <div className="board-shell">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-2">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              taskIds={columns[status]}
              taskMap={taskMap}
              canEdit={canEdit}
              boardDragging={!!activeId}
              onAdd={() => navigate(`${location.pathname}?newTask=true`)}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay dropAnimation={dropAnimation} adjustScale={false}>
            {activeTask ? (
              <TaskCard
                task={{
                  ...activeTask,
                  status:
                    findContainer(columns, activeId!) ?? activeTask.status,
                }}
                canEdit={false}
                overlay
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  )
}
