import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { ChevronDown, FolderKanban, LogOut, User } from 'lucide-react'
import { useLogout } from '@/hooks/useLogout'
import { useT } from '@/hooks/useT'

type NavMenuProps = {
  name: string
  avatar?: string
}

export default function NavMenu({ name, avatar }: NavMenuProps) {
  const logout = useLogout()
  const t = useT()

  return (
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-frost px-2.5 py-1.5 text-sm font-medium text-ink transition hover:bg-glass">
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
        className="absolute right-0 z-dropdown mt-2 w-56 origin-top-right rounded-xl border border-glass-border bg-frost p-1.5 shadow-lift transition data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink data-[focus]:bg-accent-soft data-[focus]:text-accent"
          >
            <User className="h-4 w-4" /> {t('nav.myProfile')}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink data-[focus]:bg-accent-soft data-[focus]:text-accent"
          >
            <FolderKanban className="h-4 w-4" /> {t('nav.myProjects')}
          </Link>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-danger data-[focus]:bg-danger/10"
          >
            <LogOut className="h-4 w-4" /> {t('nav.signOut')}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
