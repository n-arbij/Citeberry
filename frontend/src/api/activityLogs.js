import { apiGet } from './api'

export const listActivityLogs = () => apiGet('/activity-logs/')
