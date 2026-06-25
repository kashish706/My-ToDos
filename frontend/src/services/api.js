import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://taskflow-backend-dio0.onrender.com/api/todos'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

// Response interceptor: unwrap data or throw a clean error
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.errors?.join(', ') ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong'
    throw new Error(message)
  }
)

/** Fetch all todos */
export const fetchTodos = () => api.get('/')

/** Fetch a single todo by ID */
export const fetchTodoById = (id) => api.get(`/${id}`)

/** Create a new todo */
export const createTodo = (payload) => api.post('/', payload)

/** Update an existing todo */
export const updateTodo = (id, payload) => api.put(`/${id}`, payload)

/** Delete a todo */
export const deleteTodo = (id) => api.delete(`/${id}`)

/** Toggle todo status between Pending and Completed */
export const toggleTodoStatus = (id, currentStatus) =>
  api.put(`/${id}`, {
    status: currentStatus === 'Completed' ? 'Pending' : 'Completed',
  })
