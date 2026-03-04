import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const listInvoices = () => apiGet('/invoices/')
export const createInvoice = (data) => apiPost('/invoices/', data)
export const updateInvoice = (id, data) => apiPut(`/invoices/${id}`, data)
export const deleteInvoice = (id) => apiDelete(`/invoices/${id}`)
