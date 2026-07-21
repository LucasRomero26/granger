import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ProjectFormData } from '@/types'
import { Input, Textarea } from '@/components/ui/Input'
import { useT } from '@/hooks/useT'

type ProjectFormProps = {
  register: UseFormRegister<ProjectFormData>
  errors: FieldErrors<ProjectFormData>
}

export default function ProjectForm({ register, errors }: ProjectFormProps) {
  const t = useT()
  return (
    <>
      <Input
        label={t('project.form.name')}
        placeholder={t('project.form.namePlaceholder')}
        error={errors.projectName?.message}
        data-testid="project-name"
        {...register('projectName', { required: t('validation.projectName') })}
      />
      <Input
        label={t('project.form.client')}
        placeholder={t('project.form.clientPlaceholder')}
        error={errors.clientName?.message}
        data-testid="project-client"
        {...register('clientName', { required: t('validation.clientName') })}
      />
      <Textarea
        label={t('project.form.description')}
        placeholder={t('project.form.descriptionPlaceholder')}
        error={errors.description?.message}
        data-testid="project-description"
        {...register('description', { required: t('validation.description') })}
      />
    </>
  )
}
