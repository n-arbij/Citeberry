import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const listQuotes = () => apiGet('/quotes/')
export const createQuote = (data) => apiPost('/quotes/', data)
export const updateQuote = (id, data) => apiPut(`/quotes/${id}`, data)
export const deleteQuote = (id) => apiDelete(`/quotes/${id}`)
