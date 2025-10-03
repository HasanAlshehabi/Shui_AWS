import './viewnote.css'

export default function ViewNote({ open, note, onClose }) {
  if (!open || !note) return null
  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="note-title"
           onKeyDown={(e)=>e.key==='Escape' && onClose()}>
        <div className="glass panel viewnote-panel">
          <div className="viewnote-header">
            <div className="viewnote-user">
              <div className="viewnote-avatar">
                <img src="./src/assets/note.png" alt="" className="viewnote-icon" />
              </div>
              <div>
                <div id="note-title" className="viewnote-name">@{note.username}</div>
                <div className="viewnote-meta">
                  {new Date(note.createdAt).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}
                </div>
              </div>
            </div>
            <button className="btn" onClick={onClose}>Close</button>
          </div>

          <div className="viewnote-content">
            {note.text}
          </div>
        </div>
      </div>
    </>
  )
}
