import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { getProjects } from '@/api/ProjectAPI'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'
import ProjectCard from '@/components/projects/ProjectCard'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import PageTransition from '@/components/ui/PageTransition'
import Spinner from '@/components/ui/Spinner'

export default function DashboardView() {
  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
  const t = useT()

  if (isLoading || authLoading) return <Spinner />
  if (!data || !user) return null

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/projects/create">
          <Button data-testid="new-project-btn">
            <Plus className="h-4 w-4" /> {t('dashboard.newProject')}
          </Button>
        </Link>
      </div>

      {data.length ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title={t('dashboard.emptyTitle')}
            description={t('dashboard.emptyDesc')}
            actionLabel={t('dashboard.emptyAction')}
            actionTo="/projects/create"
          />
        </div>
      )}

      <DeleteProjectModal />
    </PageTransition>
  )
}
