const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Appelle les controllers pour chaque requête post de login ou signup
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;