import { useState } from 'react'
import QuoteList from './QuoteList'
import QuoteForm from './QuoteForm'
import QuoteView from './QuoteView'

/**
 * Quotes section wrapper — manages list / view / create / edit sub-views.
 */
export default function Quotes() {
  const [view, setView] = useState('list')      // 'list' | 'view' | 'form'
  const [selected, setSelected] = useState(null) // quote being viewed/edited

  function openCreate() { setSelected(null); setView('form') }
  function openEdit(quote) { setSelected(quote); setView('form') }
  function openView(quote) { setSelected(quote); setView('view') }
  function backToList() { setSelected(null); setView('list') }

  if (view === 'form') {
    return <QuoteForm quote={selected} onDone={backToList} onBack={backToList} />
  }

  if (view === 'view') {
    return (
      <QuoteView
        quote={selected}
        onBack={backToList}
        onEdit={() => openEdit(selected)}
        onDeleted={backToList}
      />
    )
  }

  return <QuoteList onView={openView} onEdit={openEdit} onCreate={openCreate} />
}
