import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, FolderKanban, LogOut, User } from 'lucide-react'
import { logoutUser } from '@/api/AuthAPI'
import { useT } from '@/hooks/useT'

type NavMenuProps = {
  name: string
  avatar?: string
}

export default function NavMenu({ name, avatar }: NavMenuProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const t = useT()

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      /* Even if the backend logout fails, clear the local state */
    }
    queryClient.invalidateQueries({ queryKey: ['user'] })
    navigate('/auth/login')
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex items-center gap-2 rounded-2xl border border-glass-border bg-glass px-3 py-2 text-sm font-medium text-ink backdrop-blur-xl transition hover:bg-glass-strong">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-7 w-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden sm:inline">{t('nav.hi', { name })}</span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-dropdown mt-2 w-56 origin-top-right rounded-2xl border border-glass-border bg-glass-strong p-1.5 shadow-lift backdrop-blur-xl transition data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink data-[focus]:bg-accent-soft"
          >
            <User className="h-4 w-4" /> {t('nav.myProfile')}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink data-[focus]:bg-accent-soft"
          >
            <FolderKanban className="h-4 w-4" /> {t('nav.myProjects')}
          </Link>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-danger data-[focus]:bg-danger/10"
          >
            <LogOut className="h-4 w-4" /> {t('nav.signOut')}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
