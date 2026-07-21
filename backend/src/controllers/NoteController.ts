import type { Request, Response } from 'express'
import Note from '../models/Note'
import { NotFoundError, ForbiddenError } from '../middleware/error'

export class NoteController {
  static createNote = async (req: Request, res: Response) => {
    const { content } = req.body
    const note = new Note({
      content,
      createdBy: req.user!._id,
      task: req.task!._id,
    })
    req.task!.notes.push(note._id)
    await Promise.allSettled([req.task!.save(), note.save()])
    res.status(201).json({ message: 'Note created', note: { _id: note._id, content: note.content, createdBy: req.user!._id, task: req.task!._id, createdAt: new Date() } })
  }

  static getTaskNotes = async (req: Request, res: Response) => {
    const notes = await Note.find({ task: req.task!._id })
      .populate({ path: 'createdBy', select: '_id name email avatar' })
      .lean()
    res.json(notes)
  }

  static deleteNote = async (req: Request, res: Response) => {
    const { noteId } = req.params
    const note = await Note.findById(noteId)
    if (!note) {
      throw new NotFoundError('Note not found')
    }
    if (note.createdBy.toString() !== req.user!._id.toString()) {
      throw new ForbiddenError('You do not have permission to delete this note')
    }

    req.task!.notes = req.task!.notes.filter((n) => n.toString() !== noteId)
    await Promise.allSettled([req.task!.save(), note.deleteOne()])
    res.json({ message: 'Note deleted' })
  }
}
