import { Link, NavLink } from 'react-router-dom'
import { FolderKanban, LogOut, Plus, User } from 'lucide-react'
import Logo from '@/components/Logo'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLogout } from '@/hooks/useLogout'
import { useT } from '@/hooks/useT'
import { cn } from '@/utils/utils'

type SidebarProps = {
  name: string
  email: string
  avatar?: string
}

const itemClass =
  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors duration-200'

export default function Sidebar({ name, email, avatar }: SidebarProps) {
  const logout = useLogout()
  const t = useT()

  const items = [
    { to: '/', label: t('nav.myProjects'), icon: FolderKanban, end: true },
    { to: '/projects/create', label: t('dashboard.newProject'), icon: Plus, end: false },
    { to: '/profile', label: t('nav.myProfile'), icon: User, end: false },
  ]

  return (
    <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 flex-col rounded-2xl bg-navy p-5 text-navy-fg shadow-lift lg:flex">
      <Link to="/" className="px-1 transition hover:opacity-90">
        <Logo size="sm" tone="light" />
      </Link>

      <nav className="mt-10 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                itemClass,
                isActive
                  ? 'bg-accent text-white shadow-soft'
                  : 'text-navy-muted hover:bg-navy-soft hover:text-white',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-navy-soft"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/15"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-base font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-white">{name}</span>
            <span className="block truncate text-xs text-navy-muted">{email}</span>
          </span>
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={logout}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-soft px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <LogOut className="h-4 w-4" />
            {t('nav.signOut')}
          </button>
          <LanguageToggle className="!text-navy-muted hover:!bg-navy-soft hover:!text-white" />
        </div>
      </div>
    </aside>
  )
}
