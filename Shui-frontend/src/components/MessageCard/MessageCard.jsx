import { useState} from 'react'
import './messagecard.css'

 const PREVIEW_LIMIT = 60; //this for the amount of characters to show in preview

export default function MessageCard({ message, onSave, onOpen }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(message.text)

  const isLong = (message.text ?? '').length > PREVIEW_LIMIT
  const preview = isLong
    ? `${message.text.slice(0, PREVIEW_LIMIT).trim()}…`
    : message.text

  return (
    <article
      className={`glass card ${!editing ? 'clickable' : ''}`}
      onClick={() => !editing && onOpen?.(message)}
      role={!editing ? 'button' : undefined}
      tabIndex={!editing ? 0 : undefined}
      onKeyDown={(e)=> !editing && (e.key === 'Enter' || e.key === ' ') && onOpen?.(message)}
    >
      <div className="card-top">
        <div className="card-user">
          <div className="card-avatar">
            <img src="./src/assets/note.png" alt="card-icon" className="card-icon" />
          </div>
          <div>
            <div style={{fontWeight:600}}>{message.username}</div>
            <div className="card-meta">
              {new Date(message.createdAt).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}
            </div>
          </div>
        </div>

        {!editing && (
          <button
            className="btn"
            onClick={(e)=>{ e.stopPropagation(); setEditing(true) }}>Update</button>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            className="textarea"
            rows={4}
            value={text}
            onChange={e=>setText(e.target.value)}
            onClick={(e)=>e.stopPropagation()}
          />
          <div className="card-actions">
            <button className="btn" onClick={(e)=>{ e.stopPropagation(); setEditing(false); setText(message.text) }}>Avbryt</button>
            <button className="btn btn-primary" onClick={async (e)=>{
              e.stopPropagation(); await onSave(text); setEditing(false)}}>Save</button>
          </div>
        </>
      ) : (
        <>
          <p className="card-text">{preview}</p>
          {isLong && (
            <button
              className="readmore"
              onClick={(e)=>{ e.stopPropagation(); onOpen?.(message) }}>Read more ....</button>
          )}
        </>
      )}
    </article>
  )
}
