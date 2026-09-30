// Central router: every resource router is mounted here.
// app.js only needs to require this one file.
const express = require('express');

const router = express.Router();

router.use('/recipes', require('./recipes'));
router.use('/categories', require('./categories'));

// Authentication is mounted here rather than in app.js so that swagger-autogen
// picks it up while scanning this file, which makes the login, callback, logout
// and whoami routes show up in /api-docs for the demo.
router.use('/auth', require('./auth'));

module.exports = router;
