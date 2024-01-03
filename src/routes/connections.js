'use strict'

const express = require('express');
const router = express.Router();
const connectionsController = require('../controllers/connections');
const authMiddle = require("../middleware/auth.js");
const validator = require("../middleware/validator.js");

// List all connections
router.get('/', connectionsController.read);

// Get a specific connection
router.get('/connection/:id', validator.validateId, validator.validateResult, connectionsController.connection);

// Send form for creating a new connection
router.get('/newConnection', authMiddle.isAuth, connectionsController.newConnection);

// Create a new connection
router.post('/newConnection', authMiddle.isAuth, validator.validateConnection, validator.validateResult, connectionsController.create);

// Edit a connection
router.get('/connection/:id/edit', authMiddle.isAuth, validator.validateId, validator.validateResult, connectionsController.edit);

// Update a connection
router.put('/:id', authMiddle.isAuth, validator.validateConnection, validator.validateId, connectionsController.update);

// Delete a connection
router.delete('/connection/:id/delete', authMiddle.isAuth, validator.validateId, validator.validateResult, connectionsController.delete);


exports.router = router;