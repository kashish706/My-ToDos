# Features

A complete breakdown of every feature implemented in TaskFlow.

---

## Todos List Page (`/`)

### Display
- **Responsive grid layout** — 1 column on mobile, 2 on tablet, 3 on desktop.
- Each todo card shows: title, description (truncated to 2 lines), priority badge, status badge, created date, and due date.
- **Priority colour strip** — a coloured left border on each card indicates priority at a glance (red = High, amber = Medium, green = Low).
- **Overdue indicator** — cards past their due date (and not completed) display an orange "Overdue" badge.
- Completed todos are visually dimmed and have a strikethrough title.

### Create
- Click **+ New Todo** to expand an inline form above the list.
- Form fields: title (required), description, priority (required), status, due date.
- Inline validation with error messages shown beneath each field.
- Form closes after successful creation; the new todo appears immediately.

### Edit
- Click the **✎** icon on any card to open the inline edit form pre-filled with existing data.
- Validation runs the same rules as creation.
- Changes are applied optimistically to the local state.

### Delete
- Click the **✕** icon on any card.
- A confirmation modal appears: "Delete Todo?" with the todo title shown.
- Pressing Escape or clicking outside the modal cancels the action.

### Toggle Status
- Click the **✓** icon to mark a Pending todo as Completed.
- Click **↩** to revert a Completed todo back to Pending.
- The card updates instantly without a page reload.

### Navigate to Detail
- Clicking anywhere on a card (outside the action buttons) navigates to `/todo?id=<id>`.

### Search
- Real-time search by title and description.
- Clear button (✕) appears when there is text in the search box.
- Results count is shown below the toolbar when a search or filter is active.

### Filter
Four filter chips at the top of the list:
| Filter        | Shows                                   |
|---------------|-----------------------------------------|
| All           | Every todo                              |
| Completed     | Status = Completed                      |
| Pending       | Status = Pending                        |
| High Priority | Priority = High AND Status = Pending    |

Each chip displays a count badge for quick overview.

### Sort
Dropdown with four options:
| Option      | Behaviour                            |
|-------------|--------------------------------------|
| Newest First| Sorted by `createdAt` descending (default) |
| Oldest First| Sorted by `createdAt` ascending      |
| Due Date    | Earliest due date first; no-date todos last |
| Priority    | High → Medium → Low                  |

### Loading & Error States
- A spinner animation is shown while todos are being fetched.
- An error banner with a **Retry** button appears if the API call fails.
- An empty state illustration and prompt appear when there are no matching todos.

---

## Todo Details Page (`/todo?id=`)

### Read
- Reads the `id` query parameter from the URL.
- Fetches the todo from `GET /api/todos/:id`.
- Displays all fields: title, description, priority, status, due date, and created date (with time).

### Edit
- Click **✎ Edit Todo** to replace the detail view with the edit form.
- Clicking **Cancel** restores the detail view without changes.

### Delete
- Click **✕ Delete Todo** to open the confirmation modal.
- On confirmation, the todo is deleted and the user is redirected to `/`.

### Back navigation
- A **← Back to Todos** button at the top returns to the list without modifying anything.

### Overdue detection
- If the todo's due date is in the past and it isn't completed, an "Overdue" badge is shown in red.

### 404 / missing ID
- If no `id` is provided in the URL, an error message is shown.
- If the ID does not exist on the backend, the error response is displayed with a back button.

---

## Backend Features

- **CRUD API** — full Create, Read, Update, Delete for todos via RESTful endpoints.
- **File persistence** — data stored in `todos.json`; no database required.
- **Input validation** — title and priority are required; descriptive error arrays returned on failure.
- **UUID v4 IDs** — collision-resistant unique identifiers for each todo.
- **Centralised error handling** — a global Express middleware formats all errors consistently.
- **404 handler** — unmatched routes return a structured JSON 404 response.
- **CORS** — configured to allow requests from the Vite dev server at `localhost:5173`.

---

## General

- **No page reloads** — React state is updated optimistically after API calls.
- **Keyboard accessible** — all interactive elements have focus styles; Escape closes modals.
- **Responsive design** — tested from 320px (small phones) up to 1440px (wide desktop).
- **Dark theme** — a consistent dark colour system defined in CSS custom properties.
- **Async / await** — all API calls and file operations use `async/await` throughout.
- **Reusable components** — `TodoForm`, `ConfirmModal`, `TodoCard` are shared across pages.
