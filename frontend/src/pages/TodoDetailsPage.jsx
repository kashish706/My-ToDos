// src/pages/TodoDetailsPage.jsx
// Shows complete details for a single todo; supports edit and delete

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import TodoForm from '../components/TodoForm'
import ConfirmModal from '../components/ConfirmModal'
import { fetchTodoById, updateTodo, deleteTodo } from '../services/api'
import './TodoDetailsPage.css'

/** Nicely formatted date */
function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const opts = { day: 'numeric', month: 'long', year: 'numeric' }
  if (includeTime) {
    opts.hour = '2-digit'
    opts.minute = '2-digit'
  }
  return d.toLocaleDateString('en-IN', opts)
}

function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

export default function TodoDetailsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [todo, setTodo]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  const [isEditing, setIsEditing]   = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const [showDelete, setShowDelete] = useState(false)

  // ---- Load todo ----
  const loadTodo = useCallback(async () => {
    if (!id) { setError('No todo ID provided in URL.'); setLoading(false); return }
    try {
      setLoading(true)
      setError('')
      const res = await fetchTodoById(id)
      setTodo(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadTodo() }, [loadTodo])

  // ---- Edit ----
  const handleEditSubmit = async (formData) => {
    try {
      setFormLoading(true)
      setActionError('')
      const res = await updateTodo(id, formData)
      setTodo(res.data)
      setIsEditing(false)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  // ---- Delete ----
  const handleDeleteConfirm = async () => {
    try {
      await deleteTodo(id)
      navigate('/')
    } catch (err) {
      setActionError(err.message)
      setShowDelete(false)
    }
  }

  // ---- Render states ----
  if (loading) {
    return (
      <div className="page-container">
        <div className="spinner-wrap"><div className="spinner" /> Loading todo...</div>
      </div>
    )
  }

  if (error || !todo) {
    return (
      <div className="page-container">
        <div className="alert alert-error">⚠ {error || 'Todo not found.'}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back to Todos
        </button>
      </div>
    )
  }

  const overdue = isOverdue(todo.dueDate, todo.status)

  return (
    <div className="page-container details-page">
      {/* Back button */}
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>
        ← Back to Todos
      </button>

      {actionError && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          ⚠ {actionError}
          <button className="btn-icon" onClick={() => setActionError('')} style={{ marginLeft: 'auto' }}>✕</button>
        </div>
      )}

      {isEditing ? (
        /* ---- Edit mode ---- */
        <div className="details-card">
          <h2 className="details-section-title">Edit Todo</h2>
          <TodoForm
            initialData={todo}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            isLoading={formLoading}
          />
        </div>
      ) : (
        /* ---- View mode ---- */
        <div className="details-card">
          {/* Badges row */}
          <div className="details-badges">
            <span className={`badge badge-${todo.priority.toLowerCase()}`}>{todo.priority} Priority</span>
            <span className={`badge badge-${todo.status.toLowerCase()}`}>
              {todo.status === 'Completed' ? '✓ ' : '⏳ '}{todo.status}
            </span>
            {overdue && <span className="badge badge-overdue">⚠ Overdue</span>}
          </div>

          {/* Title */}
          <h1 className={`details-title ${todo.status === 'Completed' ? 'strikethrough' : ''}`}>
            {todo.title}
          </h1>

          {/* Description */}
          <div className="details-section">
            <span className="details-label">Description</span>
            <p className="details-desc">
              {todo.description || <em className="no-desc">No description provided.</em>}
            </p>
          </div>

          <hr className="divider" />

          {/* Meta grid */}
          <div className="details-meta-grid">
            <div className="meta-block">
              <span className="details-label">Created</span>
              <span className="meta-value">{formatDate(todo.createdAt, true)}</span>
            </div>
            <div className="meta-block">
              <span className="details-label">Due Date</span>
              <span className={`meta-value ${overdue ? 'overdue-val' : ''}`}>
                {todo.dueDate ? formatDate(todo.dueDate) : '—'}
                {overdue && ' (Overdue)'}
              </span>
            </div>
            <div className="meta-block">
              <span className="details-label">Priority</span>
              <span className={`meta-value priority-val-${todo.priority.toLowerCase()}`}>
                {todo.priority}
              </span>
            </div>
            <div className="meta-block">
              <span className="details-label">Status</span>
              <span className="meta-value">{todo.status}</span>
            </div>
          </div>

          <hr className="divider" />

          {/* Action buttons */}
          <div className="details-actions">
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              ✎ Edit Todo
            </button>
            <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
              ✕ Delete Todo
            </button>
          </div>
        </div>
      )}

      {/* Todo ID tag (for developers / debugging) */}
      <p className="todo-id-tag">ID: {todo.id}</p>

      {/* Delete modal */}
      <ConfirmModal
        isOpen={showDelete}
        title="Delete this Todo?"
        message={`"${todo.title}" will be permanently deleted and cannot be recovered.`}
        confirmLabel="Yes, Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
