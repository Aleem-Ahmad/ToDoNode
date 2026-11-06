require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const connectDB = require('./dbconfig');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

// Connect to MongoDB
connectDB();

const app = express();

// View engine setup (for default views if needed)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Root & Health check routes
app.use('/', indexRouter);
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Task Manager API is running',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Resource routes
app.use('/users', usersRouter);
app.use('/api/tasks', tasksRouter);

// Catch 404
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  }
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  const isApi = req.originalUrl.startsWith('/api');
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (isApi) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  }

  // Set locals for HTML error template
  res.locals.message = message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(statusCode);
  res.render('error');
});

module.exports = app;
