
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Create
router.post('/', async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.json(blog);
});

// Read All
router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// Read One
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// Update
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
