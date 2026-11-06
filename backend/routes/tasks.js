const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask
} = require('../controllers/taskController');

// /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// /api/tasks/:id/toggle
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;

