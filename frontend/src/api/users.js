const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export async function getMe() {
  const res = await fetch(`${BASE}/api/v1/users/me`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

import { apiGet, apiPut } from './api'

export const listUsers    = ()           => apiGet('/users/')
export const setUserRole  = (id, role)   => apiPut(`/users/${id}/role`,  { role })
export const setUserLock  = (id, locked) => apiPut(`/users/${id}/lock`,  { is_locked: locked })
