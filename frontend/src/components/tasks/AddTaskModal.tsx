import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { TaskFormData } from '@/types'
import { createTask } from '@/api/TaskAPI'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useT } from '@/hooks/useT'
import TaskForm from './TaskForm'

export default function AddTaskModal() {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const projectId = params.projectId!
  const queryParams = new URLSearchParams(location.search)
  const show = queryParams.get('newTask') === 'true'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { name: '', description: '' },
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('task.created'))
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      reset()
      navigate(location.pathname, { replace: true })
    },
  })

  return (
    <Modal
      open={show}
      onClose={() => navigate(location.pathname, { replace: true })}
      title={t('task.modal.new')}
      size="md"
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit((formData) => mutate({ formData, projectId }))}
        noValidate
      >
        <TaskForm register={register} errors={errors} />
        <Button type="submit" className="w-full" disabled={isPending} data-testid="save-task-submit">
          {isPending ? t('task.modal.saving') : t('task.modal.save')}
        </Button>
      </form>
    </Modal>
  )
}
