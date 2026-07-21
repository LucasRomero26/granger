import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import type { ProjectFormData } from '@/types'
import { getProjectById, updateProject } from '@/api/ProjectAPI'
import ProjectForm from '@/components/projects/ProjectForm'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import Spinner from '@/components/ui/Spinner'
import { useT } from '@/hooks/useT'

export default function EditProjectView() {
  const params = useParams()
  const projectId = params.projectId!
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const t = useT()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    values: data
      ? {
          projectName: data.projectName,
          clientName: data.clientName,
          description: data.description,
        }
      : undefined,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateProject,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message ?? t('project.updated'))
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
      navigate('/')
    },
  })

  if (isLoading) return <Spinner />
  if (isError) return <Navigate to="/404" replace />
  if (!data) return null

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">{t('project.edit.title')}</h1>
          <p className="page-subtitle">{t('project.edit.subtitle')}</p>
        </div>
        <Link to="/">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" /> {t('project.edit.back')}
          </Button>
        </Link>
      </div>

      <form
        className="glass-panel space-y-5 p-6 md:p-10"
        onSubmit={handleSubmit((formData) => mutate({ formData, projectId }))}
        noValidate
      >
        <ProjectForm register={register} errors={errors} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('project.edit.submitting') : t('project.edit.submit')}
        </Button>
      </form>
    </PageTransition>
  )
}
