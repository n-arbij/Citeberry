import { apiGet, apiPost } from './api'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export async function listOrganizations() {
  const res = await fetch(`${BASE}/api/v1/organizations/`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to fetch organizations')
  return res.json()
}

export async function createOrganization(data) {
  const res = await fetch(`${BASE}/api/v1/organizations/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to create organization')
  }
  return res.json()
}

export async function requestToJoin(orgShortId) {
  const res = await fetch(`${BASE}/api/v1/organizations/${orgShortId}/join-requests`, {
    method: 'POST',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to send join request')
  }
  return res.json()
}

export const listJoinRequests = (orgShortId, status = 'pending') =>
  apiGet(`/organizations/${orgShortId}/join-requests?status=${status}`)

export const acceptJoinRequest = (orgShortId, requestId) =>
  apiPost(`/organizations/${orgShortId}/join-requests/${requestId}/accept`)

export const rejectJoinRequest = (orgShortId, requestId) =>
  apiPost(`/organizations/${orgShortId}/join-requests/${requestId}/reject`)

