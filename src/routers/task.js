import express from 'express';

// Define a new Router
const router = new express.Router();

// import task controller
import {
  newTask,
  getTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from '../controllers/task.js';

// Route handler to create a new task - NEW TASK
router.post('/api/tasks', newTask);

// Route handle for fetching all tasks from database - GET ALL TASKS
router.get('/api/tasks', getTasks);

// Route handle to fetch individual task by ID - GET TASK BY ID
router.get('/api/tasks/:id', getTaskById);

// Route handle to update an existing task - UPDATE TASK
router.put('/api/tasks/:id', updateTaskById);

// Route handle to delete a task by ID - DELETE TASK BY ID
router.delete('/api/tasks/:id', deleteTaskById);

// export the router
export { router as taskRouter };
