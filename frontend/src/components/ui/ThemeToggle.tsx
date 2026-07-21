import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useT } from '@/hooks/useT'
import Button from './Button'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const t = useT()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
      className="!rounded-full !p-2.5"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
