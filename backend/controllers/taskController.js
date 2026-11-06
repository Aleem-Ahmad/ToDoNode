const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const filter = {};

    // Optional filtering by completion status (?completed=true or ?completed=false)
    if (typeof req.query.completed !== 'undefined') {
      filter.completed = req.query.completed === 'true';
    }

    // Optional priority filter (?priority=high)
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Optional title search (?search=keyword)
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.name === 'CastError' ? 'Invalid Task ID format' : 'Failed to retrieve task',
      error: error.message
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      completed: completed === true || completed === 'true'
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// @desc    Update task by ID
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.name === 'CastError' ? 'Invalid Task ID format' : 'Failed to update task',
      error: error.message
    });
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
      data: task
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.name === 'CastError' ? 'Invalid Task ID format' : 'Failed to toggle status',
      error: error.message
    });
  }
};

// @desc    Delete task by ID
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.name === 'CastError' ? 'Invalid Task ID format' : 'Failed to delete task',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask
};

