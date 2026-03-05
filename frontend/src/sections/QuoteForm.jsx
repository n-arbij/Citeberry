import { useState, useCallback, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { createQuote, updateQuote } from '../api/quotes'
import { listClients } from '../api/clients'
import { listQuoteItemsByQuote, createQuoteItem, updateQuoteItem, deleteQuoteItem } from '../api/quoteItems'
import SectionShell from '../components/SectionShell'

const STATUSES = ['pending', 'accepted', 'rejected']
let _keyCounter = 0
const newKey = () => ++_keyCounter

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
    status: quote?.status ?? 'pending',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // items: {_key, id (null = new), description, quantity, unit_price}
  const [items, setItems] = useState([])
  const [deletedIds, setDeletedIds] = useState([])

  const { data: clients, loading: clientsLoading } = useFetch(useCallback(listClients, []))

  // Load existing items when editing
  useEffect(() => {
    if (isEdit) {
      listQuoteItemsByQuote(quote.id).then(existing => {
        setItems(existing.map(i => ({
          _key: newKey(),
          id: i.id,
          description: i.description,
          quantity: String(i.quantity),
          unit_price: String(i.unit_price),
        })))
      }).catch(() => {})
    }
  }, [isEdit, quote?.id])

  const total = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0
    const price = parseFloat(item.unit_price) || 0
    return sum + qty * price
  }, 0)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function addItem() {
    setItems([...items, { _key: newKey(), id: null, description: '', quantity: '1', unit_price: '0' }])
  }

  function updateItem(_key, field, value) {
    setItems(items.map(i => i._key === _key ? { ...i, [field]: value } : i))
  }

  function removeItem(item) {
    if (item.id) setDeletedIds(prev => [...prev, item.id])
    setItems(items.filter(i => i._key !== item._key))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.client_id) { setError('Please select a client.'); return }
    if (!form.title.trim()) { setError('Title is required.'); return }

    setSaving(true)
    try {
      const payload = {
        client_id: Number(form.client_id),
        title: form.title.trim(),
        description: form.description.trim() || null,
        amount: total,
        ...(isEdit ? { status: form.status } : {}),
      }

      let quoteId
      if (isEdit) {
        await updateQuote(quote.id, payload)
        quoteId = quote.id
        // Delete removed items
        await Promise.all(deletedIds.map(id => deleteQuoteItem(id)))
        // Update existing items
        await Promise.all(
          items.filter(i => i.id).map(i => {
            const qty = parseInt(i.quantity) || 0
            const price = parseFloat(i.unit_price) || 0
            return updateQuoteItem(i.id, {
              id: i.id,
              quote_id: quoteId,
              description: i.description,
              quantity: qty,
              unit_price: price,
              sub_total: qty * price,
            })
          })
        )
        // Create new items
        await Promise.all(
          items.filter(i => !i.id).map(i =>
            createQuoteItem({
              quote_id: quoteId,
              description: i.description,
              quantity: parseInt(i.quantity) || 0,
              unit_price: parseFloat(i.unit_price) || 0,
              id: 0,
              sub_total: 0,
            })
          )
        )
      } else {
        const created = await createQuote(payload)
        quoteId = created.id
        // Create all items
        await Promise.all(
          items.map(i =>
            createQuoteItem({
              quote_id: quoteId,
              description: i.description,
              quantity: parseInt(i.quantity) || 0,
              unit_price: parseFloat(i.unit_price) || 0,
              id: 0,
              sub_total: 0,
            })
          )
        )
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
          {/* ── Left column ── */}
          <div className="ds-form-col">
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
                rows={5}
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
          </div>

          {/* ── Right column ── */}
          <div className="ds-form-col">
            {/* Quote Items */}
            <div className="ds-field">
              <label>Quote Items</label>
              {items.length > 0 && (
                <table className="ds-table ds-items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const subtotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
                      return (
                        <tr key={item._key}>
                          <td>
                            <input
                              value={item.description}
                              onChange={e => updateItem(item._key, 'description', e.target.value)}
                              placeholder="Item description"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => updateItem(item._key, 'quantity', e.target.value)}
                              style={{ width: '70px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={e => updateItem(item._key, 'unit_price', e.target.value)}
                              style={{ width: '100px' }}
                            />
                          </td>
                          <td className="ds-amount">${subtotal.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="ds-btn-reject ds-btn-sm"
                              onClick={() => removeItem(item)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <button type="button" className="ds-btn-primary" onClick={addItem}>
                  + Add Item
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="ds-total-row">
              <label>Total Amount</label>
              <span className="ds-amount ds-total-amount">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* ── Full-width footer ── */}
          <div className="ds-form-footer">
            {error && <p className="ds-field-error">{error}</p>}
            <div className="ds-form-actions">
              <button type="button" className="ds-btn-ghost" onClick={onBack}>Cancel</button>
              <button type="submit" className="ds-btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create quote'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </SectionShell>
  )
}
