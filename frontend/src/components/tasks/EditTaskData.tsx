import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { Task, TaskFormData } from '@/types'
import { getTaskById, updateTask } from '@/api/TaskAPI'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { useT } from '@/hooks/useT'
import TaskForm from './TaskForm'

type EditTaskModalProps = {
  data: Task
  taskId: Task['_id']
}

function EditTaskModal({ data, taskId }: EditTaskModalProps) {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const projectId = params.projectId!

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { name: data.name, description: data.description },
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: updateTask,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message ?? t('task.updated'))
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      navigate(location.pathname, { replace: true })
    },
  })

  return (
    <Modal
      open
      onClose={() => navigate(location.pathname, { replace: true })}
      title={t('task.modal.edit')}
      size="md"
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit((formData) => mutate({ projectId, taskId, formData }))}
        noValidate
      >
        <TaskForm register={register} errors={errors} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('task.modal.saving') : t('task.modal.save')}
        </Button>
      </form>
    </Modal>
  )
}

export default function EditTaskData() {
  const location = useLocation()
  const params = useParams()
  const projectId = params.projectId!
  const queryParams = new URLSearchParams(location.search)
  const taskId = queryParams.get('editTask')

  const { data, isError, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId: taskId! }),
    enabled: !!taskId,
    retry: false,
  })

  if (!taskId) return null
  if (isLoading) return <Spinner className="fixed inset-0 z-modal bg-ink/20" />
  if (isError || !data) return null

  return <EditTaskModal data={data} taskId={taskId} />
}
