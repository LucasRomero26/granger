import { useEffect, useRef, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Ellipsis, MessageCircle } from 'lucide-react'
import type { Task } from '@/types'
import { deleteTask } from '@/api/TaskAPI'
import { statusAccent } from '@/locales/en'
import { useT, useStatusLabels } from '@/hooks/useT'
import { cn } from '@/utils/utils'

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setIsMounted(true), 50)
    return () => window.clearTimeout(t)
  }, [])
  return isMounted
}


type TaskCardProps = {
  task: Task
  canEdit: boolean
  overlay?: boolean
}

function CardBody({
  task,
  canEdit,
  showMenu,
}: {
  task: Task
  canEdit: boolean
  showMenu: boolean
}) {
  const t = useT()
  const statusLabels = useStatusLabels()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!
  const queryClient = useQueryClient()
  const noteCount = task.notes?.length ?? 0

  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('task.deleted'))
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
  })

  return (
    <div className="p-3.5">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            statusAccent[task.status],
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', statusAccent[task.status])} />
          {statusLabels[task.status]}
        </span>
        {showMenu && (
          <Menu as="div" className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <MenuButton
              className="rounded-lg p-1 text-muted opacity-0 transition duration-200 group-hover:opacity-100 hover:bg-mist/80 hover:text-ink data-[open]:opacity-100"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="sr-only">{t('common.options')}</span>
              <Ellipsis className="h-4 w-4" />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-dropdown mt-1 w-44 origin-top-right rounded-2xl border border-glass-border bg-glass-strong p-1 shadow-lift backdrop-blur-xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink data-[focus]:bg-accent-soft"
                  onClick={() => navigate(`${location.pathname}?viewTask=${task._id}`)}
                >
                  {t('task.view')}
                </button>
              </MenuItem>
              {canEdit && (
                <>
                  <MenuItem>
                    <button
                      type="button"
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink data-[focus]:bg-accent-soft"
                      onClick={() => navigate(`${location.pathname}?editTask=${task._id}`)}
                    >
                      {t('task.edit')}
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm text-danger data-[focus]:bg-danger/10"
                      onClick={() => mutate({ projectId, taskId: task._id })}
                    >
                      {t('task.delete')}
                    </button>
                  </MenuItem>
                </>
              )}
            </MenuItems>
          </Menu>
        )}
      </div>

      <p className="text-[15px] font-semibold leading-snug text-ink">{task.name}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">{task.description}</p>
      )}

      {noteCount > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-muted">
          <MessageCircle className="h-3 w-3" />
          {t('task.notes_count', { count: noteCount })}
        </div>
      )}
    </div>
  )
}

export default function TaskCard({ task, canEdit, overlay = false }: TaskCardProps) {
  const navigate = useNavigate()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    disabled: overlay,
    animateLayoutChanges,
  })
  const didDrag = useRef(false)
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  useEffect(() => {
    if (isDragging) didDrag.current = true
  }, [isDragging])

  const openTask = () => {
    if (overlay) return
    if (didDrag.current) {
      didDrag.current = false
      return
    }
    navigate(`${location.pathname}?viewTask=${task._id}`)
  }

  if (overlay) {
    return (
      <div className="task-card cursor-grabbing shadow-drag ring-2 ring-white/80 dark:ring-white/15">
        <CardBody task={task} canEdit={false} showMenu={false} />
      </div>
    )
  }

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging || mountedWhileDragging ? 0 : undefined,
        zIndex: isDragging ? 0 : undefined,
      }}
      className={cn(
        'task-card group relative list-none touch-none',
        isDragging && 'pointer-events-none shadow-none',
      )}
      {...listeners}
      {...attributes}
      onClick={openTask}
    >
      <CardBody task={task} canEdit={canEdit} showMenu />
    </li>
  )
}
