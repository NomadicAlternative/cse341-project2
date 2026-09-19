// Central router: every resource router is mounted here.
// app.js only needs to require this one file.
const express = require('express');

const router = express.Router();

router.use('/recipes', require('./recipes'));
router.use('/categories', require('./categories'));

module.exports = router;
