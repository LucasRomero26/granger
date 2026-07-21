import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import type { ProjectFormData } from '@/types'
import { createProject } from '@/api/ProjectAPI'
import ProjectForm from '@/components/projects/ProjectForm'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import { useT } from '@/hooks/useT'

export default function CreateProjectView() {
  const navigate = useNavigate()
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: { projectName: '', clientName: '', description: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: () => {
      toast.success(t('project.created'))
      navigate('/')
    },
  })

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">{t('project.create.title')}</h1>
          <p className="page-subtitle">{t('project.create.subtitle')}</p>
        </div>
        <Link to="/">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" /> {t('project.create.back')}
          </Button>
        </Link>
      </div>

      <form
        className="glass-panel space-y-5 p-6 md:p-10"
        onSubmit={handleSubmit((data) => mutate(data))}
        noValidate
        data-testid="create-project-form"
      >
        <ProjectForm register={register} errors={errors} />
        <Button type="submit" className="w-full" disabled={isPending} data-testid="create-project-submit">
          {isPending ? t('project.create.submitting') : t('project.create.submit')}
        </Button>
      </form>
    </PageTransition>
  )
}
