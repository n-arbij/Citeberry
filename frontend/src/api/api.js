const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login?session=expired'
      throw new Error('Session expired')
    }
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Request failed`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const apiGet = (path) => apiFetch(path)
export const apiPost = (path, body) => apiFetch(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
export const apiPut = (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) })
export const apiDelete = (path) => apiFetch(path, { method: 'DELETE' })
