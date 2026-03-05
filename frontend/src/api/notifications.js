import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const listNotifications     = ()     => apiGet('/notifications/')
export const createNotification    = (data) => apiPost('/notifications/', data)
export const markNotificationRead  = (id)   => apiPut(`/notifications/${id}/read`)
export const deleteNotification    = (id)   => apiDelete(`/notifications/${id}`)
