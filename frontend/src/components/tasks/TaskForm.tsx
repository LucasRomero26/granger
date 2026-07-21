import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { TaskFormData } from '@/types'
import { Input, Textarea } from '@/components/ui/Input'
import { useT } from '@/hooks/useT'

type TaskFormProps = {
  register: UseFormRegister<TaskFormData>
  errors: FieldErrors<TaskFormData>
}

export default function TaskForm({ register, errors }: TaskFormProps) {
  const t = useT()
  return (
    <>
      <Input
        label={t('task.form.name')}
        placeholder={t('task.form.namePlaceholder')}
        error={errors.name?.message}
        data-testid="task-name"
        {...register('name', { required: t('validation.taskName') })}
      />
      <Textarea
        label={t('task.form.description')}
        placeholder={t('task.form.descriptionPlaceholder')}
        error={errors.description?.message}
        data-testid="task-description"
        {...register('description', { required: t('validation.description') })}
      />
    </>
  )
}
