import { useState } from 'react'
import { createClient, updateClient } from '../api/clients'
import SectionShell from '../components/SectionShell'

export default function ClientForm({ client = null, onDone, onBack }) {
  const isEdit = !!client

  const [form, setForm] = useState({
    client_name:     client?.client_name     ?? '',
    enterprise_name: client?.enterprise_name ?? '',
    email:           client?.email           ?? '',
    phone:           client?.phone           ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.client_name.trim()) { setError('Name is required.'); return }
    if (!form.email.trim())       { setError('Email is required.'); return }

    setSaving(true)
    try {
      const payload = {
        client_name:     form.client_name.trim(),
        enterprise_name: form.enterprise_name.trim() || null,
        email:           form.email.trim(),
        phone:           form.phone.trim() || null,
      }
      if (isEdit) {
        await updateClient(client.id, payload)
      } else {
        await createClient(payload)
      }
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionShell title={isEdit ? 'Edit Client' : 'New Client'}>
      <div className="ds-form-card">
        <button className="dash-back" onClick={onBack}>← Back to clients</button>

        <form className="ds-form" onSubmit={handleSubmit} noValidate>
          <div className="ds-form-col">
            <div className="ds-field">
              <label>Full Name *</label>
              <input
                name="client_name"
                value={form.client_name}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="ds-field">
              <label>Company / Enterprise</label>
              <input
                name="enterprise_name"
                value={form.enterprise_name}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div className="ds-form-col">
            <div className="ds-field">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
              />
            </div>

            <div className="ds-field">
              <label>Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
              />
            </div>
          </div>

          <div className="ds-form-footer">
            {error && <p className="ds-field-error">{error}</p>}
            <div className="ds-form-actions">
              <button type="button" className="ds-btn-ghost" onClick={onBack}>Cancel</button>
              <button type="submit" className="ds-btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create client'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </SectionShell>
  )
}
