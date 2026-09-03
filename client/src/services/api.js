import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('libraflow_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage = 'The library server is offline. Start the server on port 5000 and try again.'
    }
    return Promise.reject(error)
  },
)

export const unwrap = (response) => response.data?.data

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then(unwrap),
  register: (payload) => api.post('/auth/register', payload).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
}

export const bookApi = {
  list: (params) => api.get('/books', { params }).then(unwrap),
  get: (id) => api.get(`/books/${id}`).then(unwrap),
}

export const borrowApi = {
  mine: () => api.get('/borrow/my').then(unwrap),
  myStats: () => api.get('/borrow/my/stats').then(unwrap),
  adminStats: () => api.get('/borrow/admin/stats').then(unwrap),
  all: () => api.get('/borrow').then(unwrap),
  borrow: (bookId) => api.post('/borrow', { bookId }).then(unwrap),
  return: (borrowId) => api.post(`/borrow/return/${borrowId}`).then(unwrap),
}

export const conversationApi = {
  list: () => api.get('/conversations').then(unwrap),
  get: (id) => api.get(`/conversations/${id}`).then(unwrap),
  remove: (id) => api.delete(`/conversations/${id}`).then(unwrap),
  chat: (payload) => api.post('/chat', payload).then(unwrap),
}

export default api
