import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react'
import { DEMO_SCREENS, isDemoMode } from '@/lib/demo'
import { cn } from '@/utils/utils'

export default function DemoNav() {
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const current = `${location.pathname}${location.search}`

  const groups = useMemo(() => {
    const map = new Map<string, typeof DEMO_SCREENS[number][]>()
    for (const screen of DEMO_SCREENS) {
      const list = map.get(screen.group) ?? []
      list.push(screen)
      map.set(screen.group, list)
    }
    return Array.from(map.entries())
  }, [])

  if (!isDemoMode) return null

  return (
    <div className="fixed bottom-4 left-4 z-toast w-[min(100%-2rem,20rem)]">
      <div className="glass-panel-strong overflow-hidden shadow-lift">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <LayoutGrid className="h-4 w-4 text-accent" />
            Demo screens
          </span>
          {open ? <ChevronDown className="h-4 w-4 text-muted" /> : <ChevronUp className="h-4 w-4 text-muted" />}
        </button>

        {open && (
          <div className="max-h-[50vh] space-y-3 overflow-y-auto border-t border-glass-border px-3 py-3">
            <p className="px-1 text-xs text-muted">
              Backend off — browsing with mock data.
            </p>
            {groups.map(([group, screens]) => (
              <div key={group}>
                <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {group}
                </p>
                <ul className="space-y-0.5">
                  {screens.map((screen) => {
                    const active =
                      screen.path === '/'
                        ? current === '/'
                        : current === screen.path || current.startsWith(`${screen.path}?`)
                    return (
                      <li key={screen.path}>
                        <Link
                          to={screen.path}
                          className={cn(
                            'block rounded-lg px-2.5 py-1.5 text-sm transition',
                            active
                              ? 'bg-accent-soft font-semibold text-accent'
                              : 'text-ink hover:bg-mist',
                          )}
                        >
                          {screen.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
