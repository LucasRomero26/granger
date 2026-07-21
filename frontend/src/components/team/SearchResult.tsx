import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { TeamMember } from '@/types'
import { addUserToProject } from '@/api/TeamAPI'
import { useT } from '@/hooks/useT'
import Button from '@/components/ui/Button'

type SearchResultProps = {
  user: TeamMember
  reset: () => void
  resetMutation: () => void
}

export default function SearchResult({ user, reset, resetMutation }: SearchResultProps) {
  const t = useT()
  const params = useParams()
  const projectId = params.projectId!
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: addUserToProject,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data ?? t('team.memberAdded'))
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] })
      reset()
      resetMutation()
    },
  })

  return (
    <div className="glass-panel flex items-center justify-between gap-3 p-4">
      <div>
        <p className="text-sm text-muted">{t('team.result')}</p>
        <p className="font-semibold text-ink">{user.name}</p>
        <p className="text-sm text-muted">{user.email}</p>
      </div>
      <Button
        size="sm"
        disabled={isPending}
        onClick={() => mutate({ projectId, id: user._id })}
      >
        {t('team.addMember')}
      </Button>
    </div>
  )
}
