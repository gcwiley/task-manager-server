// import the Task Model
import { Task } from '../models/task.js';

// Route handler to create a new task - NEW TASK
export const newTask = async (req, res) => {
  const task = new Task(req.body);

  try {
    // save task to database
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Route handler for fetching all tasks - GET ALL TASKS
// sends back an array of data
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});

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
  const _id = req.params.id;

  try {
    // filter by _id
    const task = await Task.findById({ _id });

    // if a task does not exist
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
  try {
    const _id = req.params.id;

    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    // if no task is found to update
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
  try {
    // finds and deletes task by Id
    const task = await Task.findByIdAndDelete({ _id: req.params.id });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
};

// Route handler to count all tasks within Database
export const getTaskCount = async (req, res) => {
  try {
    // counts all tasks in database
    const taskCount = await Task.countDocuments({});

    res.send(taskCount);
  } catch (error) {
    res.status(500).send();
  }
};

// Route handler to get 5 most recently created tasks
export const getRecentlyCreatedTasks = async (req, res) => {
  try {
    const mostRecentTasks = await Task.find({}).sort({ createdAt: -1 }).limit(5);

    if (!mostRecentTasks) {
      return res.status(404).send();
    }

    res.send(mostRecentTasks);
  } catch (error) {
    res.status(500).send();
  }
};
