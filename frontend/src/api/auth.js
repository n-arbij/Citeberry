const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Something went wrong')
  return data
}

export const api = {
  login(username, password) {
    return request(`/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
    })
  },

  register({ username, email, password }) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
  },
}
