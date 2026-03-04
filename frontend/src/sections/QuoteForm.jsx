import { useState, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { createQuote, updateQuote } from '../api/quotes'
import { listClients } from '../api/clients'
import SectionShell from '../components/SectionShell'

const STATUSES = ['pending', 'accepted', 'rejected']

/**
 * Shared create / edit form for quotes.
 * Pass `quote` prop to edit an existing one; omit (or null) for creation.
 */
export default function QuoteForm({ quote = null, onDone, onBack }) {
  const isEdit = !!quote

  const [form, setForm] = useState({
    client_id: quote?.client_id ?? '',
    title: quote?.title ?? '',
    description: quote?.description ?? '',
    amount: quote?.amount ?? '',
    status: quote?.status ?? 'pending',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { data: clients, loading: clientsLoading } = useFetch(useCallback(listClients, []))

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.client_id) { setError('Please select a client.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.amount || isNaN(Number(form.amount))) { setError('Enter a valid amount.'); return }

    setSaving(true)
    try {
      const payload = {
        client_id: Number(form.client_id),
        title: form.title.trim(),
        description: form.description.trim() || null,
        amount: Number(form.amount),
        ...(isEdit ? { status: form.status } : {}),
      }
      if (isEdit) {
        await updateQuote(quote.id, payload)
      } else {
        await createQuote(payload)
      }
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionShell title={isEdit ? 'Edit Quote' : 'New Quote'}>
      <div className="ds-form-card">
        <button className="dash-back" onClick={onBack}>← Back to quotes</button>

        <form className="ds-form" onSubmit={handleSubmit} noValidate>
          {/* Client */}
          <div className="ds-field">
            <label>Client *</label>
            <select name="client_id" value={form.client_id} onChange={handleChange} disabled={clientsLoading}>
              <option value="">— Select a client —</option>
              {(clients || []).map(c => (
                <option key={c.id} value={c.id}>
                  {c.client_name}{c.enterprise_name ? ` (${c.enterprise_name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="ds-field">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Quote title" />
          </div>

          {/* Description */}
          <div className="ds-field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description…"
              rows={3}
            />
          </div>

          {/* Amount */}
          <div className="ds-field">
            <label>Amount *</label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Status — only shown when editing */}
          {isEdit && (
            <div className="ds-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {error && <p className="ds-field-error">{error}</p>}

          <div className="ds-form-actions">
            <button type="button" className="ds-btn-ghost" onClick={onBack}>Cancel</button>
            <button type="submit" className="ds-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create quote'}
            </button>
          </div>
        </form>
      </div>
    </SectionShell>
  )
}
