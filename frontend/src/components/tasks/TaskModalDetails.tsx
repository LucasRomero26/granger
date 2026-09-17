import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getTaskById, updateStatus } from '@/api/TaskAPI'
import type { TaskStatus } from '@/types'
import { useT, useStatusLabels } from '@/hooks/useT'
import { formatDate } from '@/utils/utils'
import Modal from '@/components/ui/Modal'
import NotesPanel from '@/components/notes/NotesPanel'

export default function TaskModalDetails() {
  const t = useT()
  const statusLabels = useStatusLabels()
  const params = useParams()
  const projectId = params.projectId!
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const taskId = queryParams.get('viewTask')
  const show = !!taskId

  const { data, isError, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId: taskId! }),
    enabled: !!taskId,
    retry: false,
  })

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (err: Error) => toast.error(err.message),
    onSuccess: (message) => {
      toast.success(message ?? t('task.statusUpdated'))
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })

  if (isError) {
    toast.error(error.message, { id: 'task-error' })
    return <Navigate to={`/projects/${projectId}`} replace />
  }

  if (!show) return null
  if (!data) return null

  return (
    <Modal
      open={show}
      onClose={() => navigate(location.pathname, { replace: true })}
      title={data.name}
      size="xl"
    >
      <p className="text-sm text-muted">{t('task.modal.added', { date: formatDate(data.createdAt) })}</p>
      <p className="text-sm text-muted">{t('task.modal.updated', { date: formatDate(data.updatedAt) })}</p>
      <p className="mt-4 text-muted">{data.description}</p>

      {data.completedBy.length > 0 && (
        <div className="mt-6">
          <h4 className="font-display text-lg font-semibold text-ink">{t('task.modal.history')}</h4>
          <ul className="mt-3 space-y-2">
            {data.completedBy.map((log) => (
              <li key={log._id} className="rounded-lg border border-glass-border bg-glass px-3 py-2 text-sm">
                <span className="font-semibold text-ink">
                  {statusLabels[log.status]}
                </span>{' '}
                <span className="text-muted">{t('task.modal.by', { name: log.user.name })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-ink">
          {t('task.modal.currentStatus')}
        </label>
        <select
          id="status"
          data-testid="task-status-select"
          className="field"
          defaultValue={data.status}
          onChange={(e) =>
            mutate({
              projectId,
              taskId: taskId!,
              status: e.target.value as TaskStatus,
            })
          }
        >
          {Object.entries(statusLabels).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <NotesPanel notes={data.notes} />
    </Modal>
  )
}
