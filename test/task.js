const express = require('express')



const Task = require('../models/task')
const auth = require('../middleware/auth')



// define a new router
const router = new express.Router()

// Route handler to create a new task
router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        // copies all of the properties from the body to the object
        ...req.body,
        // adding on the owner property to create association
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Route handler for fetching all tasks - GET ALL TASKS
// sends back an array of data

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    // create empty sort object
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                // parseInt is a function provided by JavaScript that allows us to parse a string that contains a number into a actual integer. 
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// Route handler to fetch individual task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // filters by _id and owner value
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

// Route handler to update an existing task
router.patch('/tasks/:id', auth, async (req, res) => {
    // Error handling - making sure the user is running the operation correctly
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        // finds task that takes owner into account
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        
        // if no task to update with that ID
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        // success - send updated task back
        res.send(task)
    } catch (error) {
        // if something goes wrong - like a validation issue
        res.status(400).send(error)
    }
})

// Route Handler to delete a task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // finds and delete task that takes owner into account
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

// export the router to be used
module.exports = router