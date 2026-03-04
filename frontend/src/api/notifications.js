import { apiGet, apiPost, apiDelete } from './api'

export const listNotifications = () => apiGet('/notifications/')
export const createNotification = (data) => apiPost('/notifications/', data)
export const deleteNotification = (id) => apiDelete(`/notifications/${id}`)
