import { useState } from 'react'
import ClientList from './ClientList'
import ClientForm from './ClientForm'

export default function Clients() {
  const [view, setView]       = useState('list') // 'list' | 'form'
  const [editing, setEditing] = useState(null)   // null | client object

  function openCreate()       { setEditing(null);   setView('form') }
  function openEdit(client)   { setEditing(client); setView('form') }
  function backToList()       { setEditing(null);   setView('list') }

  if (view === 'form') {
    return <ClientForm client={editing} onDone={backToList} onBack={backToList} />
  }

  return <ClientList onEdit={openEdit} onCreate={openCreate} />
}
