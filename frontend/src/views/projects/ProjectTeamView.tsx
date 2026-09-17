import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import toast from 'react-hot-toast'
import { ArrowLeft, EllipsisVertical, UserPlus } from 'lucide-react'
import { getProjectTeam, removeUserFromProject } from '@/api/TeamAPI'
import AddMemberModal from '@/components/team/AddMemberModal'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import PageTransition from '@/components/ui/PageTransition'
import Spinner from '@/components/ui/Spinner'
import { useT } from '@/hooks/useT'

export default function ProjectTeamView() {
  const params = useParams()
  const projectId = params.projectId!
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const t = useT()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectTeam', projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  })

  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message ?? t('team.removed'))
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] })
    },
  })

  if (isLoading) return <Spinner />
  if (isError) return <Navigate to="/404" replace />
  if (!data) return null

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">{t('team.title')}</h1>
          <p className="page-subtitle">{t('team.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate(`${location.pathname}?addMember=true`)}>
            <UserPlus className="h-4 w-4" /> {t('team.add')}
          </Button>
          <Link to={`/projects/${projectId}`}>
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" /> {t('team.back')}
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="mb-4 font-display text-xl font-semibold text-ink">{t('team.current')}</h2>

      {data.length ? (
        <ul className="glass-panel divide-y divide-glass-border overflow-hidden">
          {data.map((member) => (
            <li key={member._id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-semibold text-ink">{member.name}</p>
                <p className="text-sm text-muted">{member.email}</p>
              </div>
              <Menu as="div" className="relative">
                <MenuButton className="rounded-lg p-1.5 text-muted transition hover:bg-mist hover:text-ink">
                  <span className="sr-only">{t('common.options')}</span>
                  <EllipsisVertical className="h-5 w-5" />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-dropdown mt-1 w-48 origin-top-right rounded-xl border border-glass-border bg-frost p-1 shadow-lift transition data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-danger data-[focus]:bg-danger/10"
                      onClick={() => mutate({ projectId, userId: member._id })}
                    >
                      {t('team.remove')}
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t('team.emptyTitle')} description={t('team.emptyDesc')} />
      )}

      <AddMemberModal />
    </PageTransition>
  )
}
