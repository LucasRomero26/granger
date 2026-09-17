import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { motion } from 'framer-motion'
import { ArrowUpRight, EllipsisVertical } from 'lucide-react'
import type { DashboardProject } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useT } from '@/hooks/useT'
import { isManager } from '@/utils/policies'
import Badge from '@/components/ui/Badge'
import { cn } from '@/utils/utils'

type ProjectCardProps = {
  project: DashboardProject
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const t = useT()

  const manager = isManager(project.manager, user?._id ?? '')
  const projectUrl = `/projects/${project._id}`

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="list-none"
    >
      <Link
        to={projectUrl}
        aria-label={t('project.card.open', { name: project.projectName })}
        className={cn(
          'group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-glass-border p-5',
          'bg-frost shadow-soft transition-[border-color,box-shadow] duration-300 ease-out',
          'hover:border-accent/40 hover:shadow-lift',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        <motion.div
          className="relative flex h-full flex-col"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.985, y: -2 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26, restDelta: 0.5 }}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <Badge tone={manager ? 'manager' : 'collaborator'}>
              {manager ? t('project.card.manager') : t('project.card.collaborator')}
            </Badge>
            <div
              className="flex shrink-0 items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Menu as="div" className="relative">
                <MenuButton
                  className="rounded-lg p-1.5 text-muted transition-all duration-200 ease-out hover:bg-mist hover:text-ink group-hover:text-ink data-[open]:bg-mist data-[open]:text-ink"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <span className="sr-only">{t('common.options')}</span>
                  <EllipsisVertical className="h-5 w-5" />
                </MenuButton>
                <MenuItems
                  anchor="bottom end"
                  portal
                  transition
                  className="z-dropdown w-48 origin-top-right rounded-xl border border-glass-border bg-frost p-1 shadow-lift transition data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <Link
                      to={projectUrl}
                      className="block rounded-lg px-3 py-2 text-sm text-ink data-[focus]:bg-accent-soft data-[focus]:text-accent"
                    >
                      {t('project.card.view')}
                    </Link>
                  </MenuItem>
                  {manager && (
                    <>
                      <MenuItem>
                        <Link
                          to={`/projects/${project._id}/edit`}
                          className="block rounded-lg px-3 py-2 text-sm text-ink data-[focus]:bg-accent-soft data-[focus]:text-accent"
                        >
                          {t('project.card.edit')}
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type="button"
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm text-danger data-[focus]:bg-danger/10"
                          onClick={() =>
                            navigate(`${location.pathname}?deleteProject=${project._id}`)
                          }
                        >
                          {t('project.card.delete')}
                        </button>
                      </MenuItem>
                    </>
                  )}
                </MenuItems>
              </Menu>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-bold leading-tight text-ink transition-colors duration-300 ease-out group-hover:text-accent">
              {project.projectName}
            </h3>
            <span
              aria-hidden
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 sm:translate-x-1"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <p className="mt-1 text-sm text-muted transition-transform duration-300 ease-out group-hover:-translate-y-px">
            {t('project.form.clientLabel', { name: project.clientName })}
          </p>
          <p className="mt-3 line-clamp-3 text-sm text-muted">{project.description}</p>
        </motion.div>
      </Link>
    </motion.li>
  )
}
