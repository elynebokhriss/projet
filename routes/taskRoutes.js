const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all tasks (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username').populate('createdBy', 'username');
    res.render('tasks/index.twig', { tasks });
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

// Create task form (admin only)
router.get('/create', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('username');
    res.render('tasks/create.twig', { users });
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

// Create task (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      status,
      createdBy: req.user.id
    });
    
    await task.save();
    res.redirect('/tasks');
  } catch (error) {
    console.error(error);
    res.status(400).render('tasks/create.twig', { error: 'Invalid data: please fill out all fields correctly.' });
  }
});

// Edit task form (admin only)
router.get('/:id/edit', verifyToken, isAdmin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const users = await User.find({ role: 'user' }).select('username');
    res.render('tasks/edit.twig', { task, users });
  } catch (error) {
    res.status(404).render('error.twig', { error: 'Task not found' });
  }
});

// Update task (admin only)
router.post('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      assignedTo,
      status
    });
    res.redirect('/tasks');
  } catch (error) {
    res.status(400).render('error.twig', { error: 'Invalid data' });
  }
});

// Delete task (admin only)
router.post('/:id/delete', verifyToken, isAdmin, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

module.exports = router;