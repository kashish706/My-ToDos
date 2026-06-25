// src/components/TodoCard.jsx
// Individual todo card displayed in the list

import React from 'react'
import { useNavigate } from 'react-router-dom'
import './TodoCard.css'

/** Format a date string nicely */
function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Check if due date is overdue */
function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

export default function TodoCard({ todo, onEdit, onDelete, onToggleStatus }) {
  const navigate = useNavigate()
  const overdue = isOverdue(todo.dueDate, todo.status)

  const handleCardClick = (e) => {
    // Don't navigate if clicking action buttons
    if (e.target.closest('.card-actions')) return
    navigate(`/todo?id=${todo.id}`)
  }

  return (
    <div
      className={`todo-card ${todo.status === 'Completed' ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e)}
      aria-label={`View todo: ${todo.title}`}
    >
      {/* Priority strip */}
      <div className={`priority-strip priority-${todo.priority.toLowerCase()}`} />

      <div className="card-body">
        {/* Header row */}
        <div className="card-header-row">
          <div className="card-badges">
            <span className={`badge badge-${todo.priority.toLowerCase()}`}>
              {todo.priority}
            </span>
            <span className={`badge badge-${todo.status.toLowerCase()}`}>
              {todo.status === 'Completed' ? '✓ ' : '⏳ '}{todo.status}
            </span>
            {overdue && (
              <span className="badge badge-overdue">⚠ Overdue</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className={`btn-icon ${todo.status === 'Completed' ? 'active-check' : ''}`}
              title={todo.status === 'Completed' ? 'Mark Pending' : 'Mark Complete'}
              onClick={() => onToggleStatus(todo)}
            >
              {todo.status === 'Completed' ? '↩' : '✓'}
            </button>
            <button
              className="btn-icon"
              title="Edit"
              onClick={() => onEdit(todo)}
            >
              ✎
            </button>
            <button
              className="btn-icon danger"
              title="Delete"
              onClick={() => onDelete(todo)}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="card-title">{todo.title}</h3>

        {/* Description */}
        {todo.description && (
          <p className="card-desc">{todo.description}</p>
        )}

        {/* Footer meta */}
        <div className="card-meta">
          <span className="meta-item">
            🗓 Created {formatDate(todo.createdAt)}
          </span>
          {todo.dueDate && (
            <span className={`meta-item ${overdue ? 'overdue-text' : ''}`}>
              {overdue ? '⚠ Due' : '📅 Due'} {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
