// import the Task Model
import { Task } from '../models/task.js';

// function to create a new task - NEW TASK
export const newTask = async (req, res) => {
  const task = Task.build(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Route handler for fetching all tasks - ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();

    if (!tasks) {
      return res.status(404).send();
    }

    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
};

// Route handler to fetch individual task by ID - GET TASK by ID
export const getTaskById = async (req, res) => {
  // converts id string to integer
  const id = parseInt(req.params.id);

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.send(task);
  } catch (error) {
    res.status(404).send();
  }
};

// Route handle to update an existing task - UPDATE TASK
export const updateTaskById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const task = await Task.update(req.body, {
      where: {
        id: id
      }
    });

    if (!task) {
      res.status(404).send();
    }

    res.status(200).send(task);
  } catch (error) {
    res.statuc(400).send();
  }
};

// Route handler to delete a task by ID - DELETE TASK BY ID
export const deleteTaskById = async (req, res) => {
  // convert string to integer
  const id = parseInt(req.params.id);

  try {
    const task = await Task.destroy({
      where: {
        id: id
      }
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
};

