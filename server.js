require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { suggestPriority } = require('./aiService');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GET /tasks - List all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // AI smart feature: Suggest priority based on title and description
  const aiSuggestion = await suggestPriority(title, description);

  const sql = `INSERT INTO tasks (title, description, priority, priority_reason) VALUES (?, ?, ?, ?)`;
  const params = [title, description, aiSuggestion.priority, aiSuggestion.reason];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Fetch the newly created task to return it
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });
});

// PATCH /tasks/:id - Mark a task as complete (or update status)
app.patch('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be pending or completed.' });
  }

  const sql = `UPDATE tasks SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
