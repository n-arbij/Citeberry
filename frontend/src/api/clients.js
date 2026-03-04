import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const listClients = () => apiGet('/clients/')
export const createClient = (data) => apiPost('/clients/', data)
export const updateClient = (id, data) => apiPut(`/clients/${id}`, data)
export const deleteClient = (id) => apiDelete(`/clients/${id}`)
