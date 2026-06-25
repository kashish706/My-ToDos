// src/components/TodoForm.jsx
// Reusable form for creating and editing todos

import React, { useState, useEffect } from 'react'
import './TodoForm.css'

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
}

export default function TodoForm({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title || '',
        description: initialData.description || '',
        priority:    initialData.priority || 'Medium',
        status:      initialData.status || 'Pending',
        dueDate:     initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
      })
    }
  }, [initialData])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (!form.priority) e.priority = 'Priority is required.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  const isEditing = Boolean(initialData)

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-control ${errors.title ? 'error' : ''}`}
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={120}
          autoFocus
        />
        {errors.title && <span className="form-error">⚠ {errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          placeholder="Add details, context, or notes..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Priority + Status */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="priority">
            Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            className={`form-control ${errors.priority ? 'error' : ''}`}
            value={form.priority}
            onChange={handleChange}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          {errors.priority && <span className="form-error">⚠ {errors.priority}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Pending">⏳ Pending</option>
            <option value="Completed">✅ Completed</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className="form-control"
          value={form.dueDate}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 10)}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" />
              {isEditing ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            isEditing ? '✓ Save Changes' : '+ Add Todo'
          )}
        </button>
      </div>
    </form>
  )
}
