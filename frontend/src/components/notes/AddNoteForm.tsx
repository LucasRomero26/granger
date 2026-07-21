import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { NoteFormData } from '@/types'
import { createNote } from '@/api/NoteAPI'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useT } from '@/hooks/useT'

export default function AddNoteForm() {
  const t = useT()
  const params = useParams()
  const projectId = params.projectId!
  const queryParams = new URLSearchParams(location.search)
  const taskId = queryParams.get('viewTask')!

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({ defaultValues: { content: '' } })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('note.created'))
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      reset()
    },
  })

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={handleSubmit((formData) => mutate({ projectId, taskId, formData }))}
      noValidate
    >
      <div className="flex-1">
        <Input
          label={t('note.create')}
          placeholder={t('note.placeholder')}
          error={errors.content?.message}
          data-testid="note-content"
          {...register('content', { required: t('validation.noteContent') })}
        />
      </div>
      <Button type="submit" className="sm:mt-7" disabled={isPending} data-testid="add-note-submit">
        {t('note.add')}
      </Button>
    </form>
  )
}
