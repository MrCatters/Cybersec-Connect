'use strict'

const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');

router.get('/about', (req, res) => {
    mainController.about(req, res);
});

router.get('/connection', (req, res) => {
    mainController.connection(req, res);
});

router.get('/contact', (req, res) => {
    mainController.contact(req, res);
});

router.get('/', (req, res) => {
    mainController.index(req, res);
});

router.get('/index', (req, res) => {
    mainController.index(req, res);
});

exports.router = router;
