import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { Note } from '@/types'
import { deleteNote } from '@/api/NoteAPI'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'
import Button from '@/components/ui/Button'

type NoteDetailProps = {
  note: Note
}

export default function NoteDetail({ note }: NoteDetailProps) {
  const t = useT()
  const { data: user } = useAuth()
  const params = useParams()
  const projectId = params.projectId!
  const queryParams = new URLSearchParams(location.search)
  const taskId = queryParams.get('viewTask')!
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('note.deleted'))
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })

  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-glass-border bg-glass px-4 py-3">
      <div>
        <p className="text-sm text-ink">{note.content}</p>
        <p className="mt-1 text-xs text-muted">{t('note.by', { name: note.createdBy.name })}</p>
      </div>
      {user?._id === note.createdBy._id && (
        <Button
          variant="ghost"
          size="sm"
          className="!text-danger"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >
          {t('note.delete')}
        </Button>
      )}
    </div>
  )
}
