import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { CheckPasswordForm } from '@/types'
import { checkPassword } from '@/api/AuthAPI'
import { deleteProject } from '@/api/ProjectAPI'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useT } from '@/hooks/useT'

export default function DeleteProjectModal() {
  const location = useLocation()
  const navigate = useNavigate()
  const t = useT()
  const queryParams = new URLSearchParams(location.search)
  const deleteProjectId = queryParams.get('deleteProject')
  const show = !!deleteProjectId

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckPasswordForm>({ defaultValues: { password: '' } })

  const queryClient = useQueryClient()

  const checkUserPasswordMutation = useMutation({
    mutationFn: checkPassword,
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('project.deleted'))
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate(location.pathname, { replace: true })
    },
  })

  const handleForm = async (formData: CheckPasswordForm) => {
    if (!deleteProjectId) return
    await checkUserPasswordMutation.mutateAsync(formData)
    await deleteProjectMutation.mutateAsync(deleteProjectId)
  }

  return (
    <Modal
      open={show}
      onClose={() => navigate(location.pathname, { replace: true })}
      title={t('project.delete.title')}
      size="md"
    >
      <p className="text-muted">{t('project.delete.body')}</p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit(handleForm)} noValidate>
        <Input
          label={t('project.delete.password')}
          type="password"
          autoComplete="current-password"
          placeholder={t('project.delete.passwordPlaceholder')}
          error={errors.password?.message}
          {...register('password', { required: t('validation.password') })}
        />
        <Button type="submit" variant="danger" className="w-full">
          {t('project.delete.submit')}
        </Button>
      </form>
    </Modal>
  )
}
