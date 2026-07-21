import type { Note } from '@/types'
import { useT } from '@/hooks/useT'
import AddNoteForm from './AddNoteForm'
import NoteDetail from './NoteDetail'

type NotesPanelProps = {
  notes: Note[]
}

export default function NotesPanel({ notes }: NotesPanelProps) {
  const t = useT()
  return (
    <div className="mt-8 border-t border-glass-border pt-6">
      <h4 className="mb-4 font-display text-lg font-semibold text-ink">{t('note.title')}</h4>
      <AddNoteForm />
      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted">{t('note.empty')}</p>
        ) : (
          notes.map((note) => <NoteDetail key={note._id} note={note} />)
        )}
      </div>
    </div>
  )
}
