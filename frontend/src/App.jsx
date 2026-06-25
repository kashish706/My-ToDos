// src/App.jsx
// Root component: sets up React Router and app shell

import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import TodosPage from './pages/TodosPage'
import TodoDetailsPage from './pages/TodoDetailsPage'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span>✦</span> TaskFlow
      </NavLink>
      <span className="navbar-subtitle">Stay organised, stay ahead</span>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<TodosPage />} />
          <Route path="/todo" element={<TodoDetailsPage />} />
          {/* Catch-all */}
          <Route
            path="*"
            element={
              <div className="page-container">
                <div className="empty-state">
                  <div className="empty-icon">404</div>
                  <p className="empty-title">Page not found</p>
                  <NavLink to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
                    ← Back to Todos
                  </NavLink>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
