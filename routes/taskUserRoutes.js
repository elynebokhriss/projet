const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get tasks for the authenticated user
router.get('/my-tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'username');
    res.render('tasks_user/user-tasks.twig', { tasks });
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

// Edit task form
router.get('/:id/edit', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('error.twig', { error: 'Task not found' });
    }
    const users = await User.find().select('username');
    res.render('tasks_user/edit.twig', { task, users });
  } catch (error) {
    res.status(404).render('error.twig', { error: 'Task not found' });
  }
});

// Update task
router.post('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('error.twig', { error: 'Task not found' });
    }
    await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      assignedTo,
      status
    });
    res.redirect('/tasks_user/my-tasks');
  } catch (error) {
    res.status(400).render('error.twig', { error: 'Invalid data' });
  }
});


module.exports = router;