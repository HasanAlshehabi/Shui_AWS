import { useEffect, useState,useCallback } from 'react'
import { listMessages, createMessage, updateMessage } from '../../api'
import FilterBar from '../../components/FilterBar/FilterBar'
import MessageCard from '../../components/MessageCard/MessageCard'
import Composer from '../../components/Composer/Composer'
import ViewNote from '../../components/ViewNote/ViewNote'
import './Home.css'

export default function Home() {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('desc')
  const [userSearch, setUserSearch] = useState('') 
  const [isComposerOpen, setIsComposerOpen] = useState(false) 
  const [isViewerOpen, setIsViewerOpen] = useState(false) 
  const [selectedNote, setSelectedNote] = useState(null) 
  const [errorMessage, setErrorMessage] = useState('')  

  const cleanUserSearch = (val) =>
    typeof val === 'string'
      ? val
      : (val?.target?.value ?? val?.value ?? '').toString()

  const fetchNotes = useCallback(async () => {
    const username = cleanUserSearch(userSearch)
    setIsLoading(true)
    setErrorMessage('')
    try {
      const data = await listMessages({ username: username || undefined, order: sortOrder })
      setNotes(data)
    } catch (e) {
      setErrorMessage(e.message || 'Något gick fel')
    } finally {
      setIsLoading(false)
    }
  }, [sortOrder, userSearch])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  return (
    <div className="container home">
      <div className="glass" style={{ borderRadius: 16 }}>
        <FilterBar
          order={sortOrder}
          setOrder={setSortOrder}
          userFilter={userSearch}
          setUserFilter={setUserSearch}
          onRefresh={fetchNotes}
        />
      </div>

      {errorMessage && <div className="glass home-error">{errorMessage}</div>}

      {isLoading ? (
        <div className="home-overlays">
          <div className="glass home-overlay">
            <div className="overlay" style={{ width: 160, marginBottom: 10 }} />
            <div className="overlay" style={{ width: '75%' }} />
          </div>
          <div className="glass home-overlay">
            <div className="overlay" style={{ width: 140, marginBottom: 10 }} />
            <div className="overlay" style={{ width: '60%' }} />
          </div>
        </div>
      ) : notes.length === 0 ? (
        <div className="glass home-empty">
          <p className="home-empty-title">No messages here yet.</p>
          <p className="home-empty-sub">Click on the purple button to write your first note.</p>
        </div>
      ) : (
        <div className="home-cards">
          {notes.map(n => (
            <MessageCard
              key={n.id}
              message={n}
              onOpen={(note) => { setSelectedNote(note); setIsViewerOpen(true) }}
              onSave={async (newText) => {
                const updated = await updateMessage(n.id, { text: newText })
                setNotes(prev => prev.map(x => x.id === n.id ? updated : x))
              }}
            />
          ))}
        </div>
      )}

      <button
        className="newnote"
        aria-label="Write a new note."
        onClick={() => setIsComposerOpen(true)}
      >
        <img src="/write-note.png" alt="" className="new-note" />
      </button>

      <Composer
        open={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={async ({ username, text }) => {
          const created = await createMessage({ username, text })
          setNotes(prev => [created, ...prev])
          setIsComposerOpen(false)
        }}
      />

      <ViewNote
        open={isViewerOpen}
        note={selectedNote}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  )
}
