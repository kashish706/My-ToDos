# TaskFlow — Full Stack Todo App

A clean, dark-themed productivity app built with **React** (frontend) and **Node.js + Express** (backend). Manage todos with priorities, due dates, search, filtering, and sorting — all in a responsive, professional interface.

---

## Tech Stack

| Layer    | Technology                           |
|----------|--------------------------------------|
| Frontend | React 18, React Router v6, Axios     |
| Backend  | Node.js, Express.js, UUID            |
| Storage  | JSON file (`backend/data/todos.json`)|
| Styling  | Custom CSS with CSS variables        |

---

## Project Structure

```
todo-app/
├── backend/
│   ├── server.js                  # Express entry point
│   ├── package.json
│   ├── routes/
│   │   └── todoRoutes.js          # Route definitions
│   ├── controllers/
│   │   └── todoController.js      # CRUD business logic
│   ├── middleware/
│   │   └── errorHandler.js        # Global error + 404 handler
│   └── data/
│       └── todos.json             # Persisted data store
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx               # React root
        ├── App.jsx                # Router + Navbar
        ├── index.css              # Global design system
        ├── pages/
        │   ├── TodosPage.jsx      # / — List + CRUD
        │   └── TodoDetailsPage.jsx # /todo?id= — Detail view
        ├── components/
        │   ├── TodoCard.jsx       # Individual todo card
        │   ├── TodoForm.jsx       # Add / Edit form
        │   └── ConfirmModal.jsx   # Delete confirmation dialog
        └── services/
            └── api.js             # Axios API service layer
```

---

## Installation

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone / download the project

```bash
git clone <repo-url>
cd todo-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Running the App

### Start the Backend

```bash
cd backend
npm run dev       # uses nodemon (auto-restart on change)

```

Backend runs at: **http://localhost:5000**

### Start the Frontend

Open a **new terminal tab**:

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies `/api` requests to the backend automatically — no CORS issues during development.

---

## Pages

| Route         | Description                          |
|---------------|--------------------------------------|
| `/`           | Todos list with search, filter, sort |
| `/todo?id=:id`| Detailed view of a single todo       |

---

## Notes

- Data is persisted in `backend/data/todos.json`. The file is auto-created with sample todos.
- The app uses `uuid` for unique IDs — no database setup required.
- Delete a todo from either the list page (card actions) or the details page.
