# Backend REST API

This is the Express & MongoDB REST API for the To Do / Task Manager application.

## Getting Started

### 1. Environment Setup
The server reads configuration from `.env` in the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 2. Run the Server
From the `backend` folder:

```bash
# Production start
npm start

# Development mode with auto-reload (Node.js 22+ watch mode)
npm run dev
```

The server runs at **`http://localhost:5000`**.

---

## API Endpoints

### Base & Health
- `GET /api` — API information and endpoint list
- `GET /api/health` — Server health check and uptime

### Tasks (`/api/tasks`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports `?completed=true|false`, `?search=term`, `?priority=high`) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle task completion status (`completed = !completed`) |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID |

---

## Request & Response Examples

### 1. Create a Task
**`POST /api/tasks`**
```json
{
  "title": "Build Frontend UI",
  "description": "Connect React list and form with backend API",
  "priority": "high"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "6aedad787e9edd3ae0ef4cca",
    "title": "Build Frontend UI",
    "description": "Connect React list and form with backend API",
    "completed": false,
    "priority": "high",
    "dueDate": null,
    "createdAt": "2026-11-06T10:35:36.370Z",
    "updatedAt": "2026-11-06T10:35:36.370Z"
  }
}
```

### 2. Fetch All Tasks
**`GET /api/tasks`**

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6aedad787e9edd3ae0ef4cca",
      "title": "Build Frontend UI",
      "description": "Connect React list and form with backend API",
      "completed": false,
      "priority": "high",
      "createdAt": "2026-11-06T10:35:36.370Z",
      "updatedAt": "2026-11-06T10:35:36.370Z"
    }
  ]
}
```

### 3. Toggle Completion
**`PATCH /api/tasks/:id/toggle`**

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": {
    "_id": "6aedad787e9edd3ae0ef4cca",
    "completed": true
  }
}
```

### 4. Delete a Task
**`DELETE /api/tasks/:id`**

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "6aedad787e9edd3ae0ef4cca"
  }
}
```

