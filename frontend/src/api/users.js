import { apiGet, apiPut, apiDelete } from './api'

export const getMe        = ()           => apiGet('/users/me')
export const listUsers    = ()           => apiGet('/users/')
export const setUserRole  = (id, role)   => apiPut(`/users/${id}/role`,  { role })
export const setUserLock  = (id, locked) => apiPut(`/users/${id}/lock`,  { is_locked: locked })
export const updateMe     = (data)       => apiPut('/users/me', data)
export const deleteMe     = ()           => apiDelete('/users/me')
