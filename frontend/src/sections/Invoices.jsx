import { useState } from 'react'
import InvoiceList from './InvoiceList'
import InvoiceView from './InvoiceView'

export default function Invoices() {
  const [view, setView] = useState('list')
  const [selected, setSelected] = useState(null)

  function openView(invoice) { setSelected(invoice); setView('view') }
  function backToList() { setSelected(null); setView('list') }

  if (view === 'view') {
    return <InvoiceView invoice={selected} onBack={backToList} onDeleted={backToList} />
  }

  return <InvoiceList onView={openView} />
}
