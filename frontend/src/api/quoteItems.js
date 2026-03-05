import { apiGet, apiPost, apiPut, apiDelete } from './api'

export const listQuoteItemsByQuote = (quoteId) => apiGet(`/quote-items/quote/${quoteId}`)
export const createQuoteItem = (data) => apiPost('/quote-items/', data)
export const updateQuoteItem = (id, data) => apiPut(`/quote-items/${id}`, data)
export const deleteQuoteItem = (id) => apiDelete(`/quote-items/${id}`)
