require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

const healthRoutes       = require('./routes/health.routes');
const authRoutes         = require('./routes/auth.routes');
const taskRoutes         = require('./routes/task.routes');
const availabilityRoutes = require('./routes/availability.routes');
const scheduleRoutes     = require('./routes/schedule.routes');
const analyticsRoutes    = require('./routes/analytics.routes');

app.use('/health',       healthRoutes);
app.use('/auth',         authRoutes);
app.use('/tasks',        taskRoutes);
app.use('/availability', availabilityRoutes);
app.use('/schedule',     scheduleRoutes);
app.use('/analytics',    analyticsRoutes);

const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = app;
