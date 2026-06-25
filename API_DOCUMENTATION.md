# API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this envelope:
```json
{ "success": true | false, "data": ..., "error": "...", "errors": [...] }
```

---

## Endpoints

### GET /todos
Returns all todos.

**Response 200**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Set up project",
      "description": "Initialize the repo and install dependencies.",
      "priority": "High",
      "status": "Completed",
      "dueDate": "2025-06-01",
      "createdAt": "2025-05-28T10:00:00.000Z"
    }
  ]
}
```

---

### GET /todos/:id
Returns a single todo.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Set up project",
    "description": "Initialize the repo.",
    "priority": "High",
    "status": "Completed",
    "dueDate": "2025-06-01",
    "createdAt": "2025-05-28T10:00:00.000Z"
  }
}
```

**Response 404**
```json
{ "success": false, "error": "Todo not found." }
```

---

### POST /todos
Creates a new todo.

**Request Body**
```json
{
  "title": "Write unit tests",
  "description": "Cover all API routes.",
  "priority": "Medium",
  "status": "Pending",
  "dueDate": "2025-06-20"
}
```
- `title` — **required**, string
- `priority` — **required**, one of `"Low"`, `"Medium"`, `"High"`
- `description`, `status`, `dueDate` — optional

**Response 201**
```json
{
  "success": true,
  "data": {
    "id": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
    "title": "Write unit tests",
    "description": "Cover all API routes.",
    "priority": "Medium",
    "status": "Pending",
    "dueDate": "2025-06-20",
    "createdAt": "2025-06-10T14:22:00.000Z"
  }
}
```

**Response 400 — Validation error**
```json
{
  "success": false,
  "errors": ["Title is required.", "Priority must be one of: Low, Medium, High."]
}
```

---

### PUT /todos/:id
Updates an existing todo. Only include fields you want to change.

**Request Body** (all fields optional)
```json
{
  "status": "Completed"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
    "title": "Write unit tests",
    "description": "Cover all API routes.",
    "priority": "Medium",
    "status": "Completed",
    "dueDate": "2025-06-20",
    "createdAt": "2025-06-10T14:22:00.000Z"
  }
}
```

**Response 404**
```json
{ "success": false, "error": "Todo not found." }
```

---

### DELETE /todos/:id
Deletes a todo permanently.

**Response 200**
```json
{ "success": true, "message": "Todo deleted successfully." }
```

**Response 404**
```json
{ "success": false, "error": "Todo not found." }
```

---

### GET /health
Health check endpoint.

**Response 200**
```json
{ "success": true, "message": "Todo API is running." }
```

---

## Todo Schema

| Field       | Type                          | Required | Notes                        |
|-------------|-------------------------------|----------|------------------------------|
| id          | string (UUID v4)              | auto     | Generated on creation        |
| title       | string (max 120 chars)        | yes      |                              |
| description | string (max 500 chars)        | no       | Defaults to `""`             |
| priority    | `"Low"` \| `"Medium"` \| `"High"` | yes  |                              |
| status      | `"Pending"` \| `"Completed"`  | no       | Defaults to `"Pending"`      |
| dueDate     | date string `YYYY-MM-DD`      | no       | Defaults to `null`           |
| createdAt   | ISO 8601 datetime string      | auto     | Set on creation, never updated |
