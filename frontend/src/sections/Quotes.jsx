import { useState } from 'react'
import QuoteList from './QuoteList'
import QuoteForm from './QuoteForm'

/**
 * Quotes section wrapper — manages list / create / edit sub-views.
 */
export default function Quotes() {
  const [view, setView] = useState('list')     // 'list' | 'form'
  const [editing, setEditing] = useState(null) // null | quote object

  function openCreate() { setEditing(null); setView('form') }
  function openEdit(quote) { setEditing(quote); setView('form') }
  function backToList() { setEditing(null); setView('list') }

  if (view === 'form') {
    return <QuoteForm quote={editing} onDone={backToList} onBack={backToList} />
  }

  return <QuoteList onEdit={openEdit} onCreate={openCreate} />
}
