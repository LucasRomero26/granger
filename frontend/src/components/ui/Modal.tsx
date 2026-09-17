import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/utils'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg' | 'xl'
}

const sizes = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const soft = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = 'lg',
}: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <Dialog open={open} onClose={onClose} className="relative z-modal">
          <DialogBackdrop className="fixed inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={soft}
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            />
          </DialogBackdrop>
          <div className="fixed inset-0 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <DialogPanel
                className={cn(
                  'relative w-full outline-none',
                  sizes[size],
                  className,
                )}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={soft}
                  className="rounded-2xl bg-frost p-6 text-left shadow-float md:p-10"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-muted transition duration-300 hover:bg-glass hover:text-ink"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  {title && (
                    <DialogTitle className="mb-6 pr-10 font-display text-2xl font-bold tracking-[-0.02em] text-ink md:text-3xl">
                      {title}
                    </DialogTitle>
                  )}
                  {children}
                </motion.div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      ) : null}
    </AnimatePresence>
  )
}
