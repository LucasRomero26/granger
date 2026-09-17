import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Users } from 'lucide-react'
import { getFullProject } from '@/api/ProjectAPI'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'
import { isManager } from '@/utils/policies'
import { userIdOf, type User } from '@/types'
import TaskList from '@/components/tasks/TaskList'
import AddTaskModal from '@/components/tasks/AddTaskModal'
import EditTaskData from '@/components/tasks/EditTaskData'
import TaskModalDetails from '@/components/tasks/TaskModalDetails'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/ui/PageTransition'
import Spinner from '@/components/ui/Spinner'

export default function ProjectDetailsView() {
  const params = useParams()
  const projectId = params.projectId!
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const t = useT()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getFullProject(projectId),
    retry: false,
  })

  if (isLoading) return <Spinner />
  if (isError) return <Navigate to="/404" replace />
  if (!data || !user) return null

  const canEdit = isManager(data.manager, user._id)

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div>
            <h1 className="page-title !text-3xl md:!text-[2rem]">{data.projectName}</h1>
            <p className="page-subtitle !mt-1 !text-base">{data.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex -space-x-2">
            {(data.team.length ? data.team : [data.manager]).slice(0, 5).map((member, i) => {
              const id = userIdOf(member)
              const name = typeof member === 'string' ? null : (member as User).name
              const avatar = typeof member === 'string' ? null : (member as User).avatar
              const initials = (name ?? id ?? '?').charAt(0).toUpperCase()
              return (
                <motion.span
                  key={id || i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-frost bg-accent-soft text-[10px] font-bold text-accent shadow-soft"
                  title={name ?? undefined}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name ?? 'member'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </motion.span>
              )
            })}
            {data.team.length > 5 && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-frost bg-glass text-[10px] font-bold text-muted shadow-soft">
                +{data.team.length - 5}
              </span>
            )}
          </div>
          {canEdit && (
            <>
              <Button onClick={() => navigate(`${location.pathname}?newTask=true`)} data-testid="create-task-btn">
                <Plus className="h-4 w-4" /> {t('project.details.create')}
              </Button>
              <Link to={`/projects/${projectId}/team`}>
                <Button variant="secondary">
                  <Users className="h-4 w-4" /> {t('project.details.team')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <TaskList tasks={data.tasks} canEdit={canEdit} />
      <AddTaskModal />
      <EditTaskData />
      <TaskModalDetails />
    </PageTransition>
  )
}
