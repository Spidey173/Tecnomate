# Smart Task Manager API

A lightweight, clean backend API for managing tasks, featuring an AI-powered smart prioritization system. Built with Node.js, Express, and SQLite.

## Features

- **CRUD Operations**: Minimalist API for creating, viewing, and updating tasks.
- **Smart Feature**: Auto-priority suggestions using Google Gemini AI. Based on the task title and description, the API intelligently suggests a priority (`low`, `medium`, `high`) and provides a brief reasoning.
- **Persistence**: SQLite database (created dynamically) for reliable local storage without external database dependencies.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Google Gemini API Key (optional but required for the Smart Feature to work properly).

## Setup & Run Instructions

1. **Install Dependencies**
   Run the following command in the root directory to install the required packages:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the provided `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and insert your Google Gemini API key:
   ```env
   PORT=3000
   GEMINI_API_KEY="your_api_key_here"
   ```
   *(If you do not provide a key, the API will fall back to a default priority of `medium`.)*

3. **Start the Server**
   Run the server using Node:
   ```bash
   node server.js
   ```
   The server will start and automatically create the SQLite database (`tasks.db`) if it doesn't exist.

## API Endpoints

### 1. List All Tasks
- **Endpoint**: `GET /tasks`
- **Response**: Returns a JSON array of all tasks, ordered by creation date (newest first).

### 2. Create a Task
- **Endpoint**: `POST /tasks`
- **Body** (JSON):
  ```json
  {
    "title": "Buy groceries",
    "description": "Need milk, eggs, and bread"
  }
  ```
- **Response**: Returns the newly created task, including the AI-generated `priority` and `priority_reason`.

### 3. Mark a Task as Complete
- **Endpoint**: `PATCH /tasks/{id}`
- **Body** (JSON):
  ```json
  {
    "status": "completed"
  }
  ```
- **Response**: Returns the updated task object.

## Testing / Demo (cURL)

You can quickly test the API from your terminal using `curl`:

```bash
# 1. Create a task (AI will generate priority)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Review candidate submission", "description": "Check the code, decision log, and API functionality."}'

# 2. List all tasks
curl http://localhost:3000/tasks

# 3. Mark a task as completed (assuming task ID 1)
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## Design Philosophy

- **Simplicity**: No complex ORMs or Docker setups. SQLite is perfect for this scale.
- **Resilience**: The AI feature includes defensive JSON parsing and enum validation to ensure unexpected LLM outputs do not break the database.
