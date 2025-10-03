import { useEffect, useRef, useState } from 'react'
import './composer.css'

export default function Composer({ open, onClose, onSubmit }) {
  // friendlier state names
  const [author, setAuthor] = useState('')
  const [noteText, setNoteText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const modalRef = useRef(null)

  // focus the modal when it opens
  useEffect(() => {
    if (open) setTimeout(() => modalRef.current?.focus(), 0)
  }, [open])

  if (!open) return null

  function handleFormSubmit(e) {
    e.preventDefault()
    const username = author.trim()
    const text = noteText.trim()

    if (!username || !text) {
      setErrorMessage('both fields are required')
      return
    }

    setErrorMessage('')
    onSubmit({ username, text })
    setAuthor('')
    setNoteText('')
    onClose()
  }

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        ref={modalRef}
        className="modal"
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <form className="glass panel" onSubmit={handleFormSubmit}>
          <h2 style={{ marginTop: 0 }}>Write a new note</h2>

          <textarea
            className="textarea"
            rows={6}
            placeholder="What's on your mind?"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />

          <div className="panel-footer">
            <input
              className="input"
              placeholder="Username"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Post</button>
            <button type="button" className="btn" onClick={onClose}>Close</button>
          </div>

          {errorMessage && (
            <div style={{ color: '#fecaca', marginTop: 8 }}>{errorMessage}</div>
          )}
        </form>
      </div>
    </>
  )
}
