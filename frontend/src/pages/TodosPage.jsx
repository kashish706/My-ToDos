// src/pages/TodosPage.jsx
// Main page: lists todos, search/filter/sort, add/edit/delete

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import TodoCard from '../components/TodoCard'
import TodoForm from '../components/TodoForm'
import ConfirmModal from '../components/ConfirmModal'
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
} from '../services/api'
import './TodosPage.css'

// ---- Filter / Sort constants ----
const FILTER_OPTIONS = ['All', 'Completed', 'Pending', 'High Priority']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
]

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }

export default function TodosPage() {
  // ---- State ----
  const [todos, setTodos]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  const [searchQuery, setSearchQuery]   = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy]             = useState('newest')

  const [showForm, setShowForm]         = useState(false)
  const [editingTodo, setEditingTodo]   = useState(null)
  const [formLoading, setFormLoading]   = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null) // todo to delete
  const [actionError, setActionError]   = useState('')

  // ---- Load todos ----
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetchTodos()
      setTodos(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTodos() }, [loadTodos])

  // ---- Derived: filtered + sorted list ----
  const displayedTodos = useMemo(() => {
    let list = [...todos]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    }

    // Filter
    if (activeFilter === 'Completed')    list = list.filter((t) => t.status === 'Completed')
    if (activeFilter === 'Pending')      list = list.filter((t) => t.status === 'Pending')
    if (activeFilter === 'High Priority') list = list.filter((t) => t.priority === 'High')

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return 0
    })

    return list
  }, [todos, searchQuery, activeFilter, sortBy])

  // ---- Stats ----
  const stats = useMemo(() => ({
    total:     todos.length,
    completed: todos.filter((t) => t.status === 'Completed').length,
    pending:   todos.filter((t) => t.status === 'Pending').length,
    high:      todos.filter((t) => t.priority === 'High' && t.status === 'Pending').length,
  }), [todos])

  // ---- Handlers ----
  const openAddForm = () => { setEditingTodo(null); setShowForm(true); setActionError('') }
  const openEditForm = (todo) => { setEditingTodo(todo); setShowForm(true); setActionError('') }
  const closeForm   = () => { setShowForm(false); setEditingTodo(null) }

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true)
      setActionError('')
      if (editingTodo) {
        const res = await updateTodo(editingTodo.id, formData)
        setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? res.data : t)))
      } else {
        const res = await createTodo(formData)
        setTodos((prev) => [res.data, ...prev])
      }
      closeForm()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleStatus = async (todo) => {
    try {
      const res = await toggleTodoStatus(todo.id, todo.status)
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? res.data : t)))
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteTodo(deleteTarget.id)
      setTodos((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setActionError(err.message)
      setDeleteTarget(null)
    }
  }

  // ---- Render ----
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header todos-header">
        <div>
          <h1 className="page-title">My Todos</h1>
          <p className="page-subtitle">
            {stats.pending} pending · {stats.completed} completed · {stats.high} high priority
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddForm}>
          + New Todo
        </button>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="alert alert-error">
          ⚠ {actionError}
          <button className="btn-icon" onClick={() => setActionError('')} style={{ marginLeft: 'auto' }}>✕</button>
        </div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="form-panel">
          <h2 className="form-panel-title">
            {editingTodo ? 'Edit Todo' : 'New Todo'}
          </h2>
          {actionError && <div className="alert alert-error">⚠ {actionError}</div>}
          <TodoForm
            initialData={editingTodo}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            isLoading={formLoading}
          />
        </div>
      )}

      {/* Search + Sort bar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="sort-wrap">
          <label className="sr-only" htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            className="form-control sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter chips */}
      <div className="filter-chips">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            {f === 'All' && <span className="chip-count">{todos.length}</span>}
            {f === 'Completed' && <span className="chip-count">{stats.completed}</span>}
            {f === 'Pending' && <span className="chip-count">{stats.pending}</span>}
            {f === 'High Priority' && <span className="chip-count">{stats.high}</span>}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(searchQuery || activeFilter !== 'All') && !loading && (
        <p className="results-count">
          Showing {displayedTodos.length} of {todos.length} todos
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
          Loading todos...
        </div>
      ) : error ? (
        <div className="alert alert-error">
          ⚠ {error}
          <button className="btn btn-sm btn-secondary" onClick={loadTodos} style={{ marginLeft: 'auto' }}>
            Retry
          </button>
        </div>
      ) : displayedTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {searchQuery ? '🔍' : activeFilter !== 'All' ? '🔎' : '✓'}
          </div>
          <p className="empty-title">
            {searchQuery
              ? 'No todos match your search'
              : activeFilter !== 'All'
              ? `No ${activeFilter.toLowerCase()} todos`
              : 'No todos yet'}
          </p>
          <p className="empty-desc">
            {searchQuery
              ? 'Try different keywords.'
              : activeFilter !== 'All'
              ? 'Try a different filter.'
              : 'Create your first todo to get started.'}
          </p>
          {!searchQuery && activeFilter === 'All' && (
            <button className="btn btn-primary" onClick={openAddForm} style={{ marginTop: 12 }}>
              + New Todo
            </button>
          )}
        </div>
      ) : (
        <div className="todos-grid">
          {displayedTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={openEditForm}
              onDelete={setDeleteTarget}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Todo?"
        message={deleteTarget ? `"${deleteTarget.title}" will be permanently deleted.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
