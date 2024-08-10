const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User login
router.post('/user/login', authController.userLogin);

// Organization login
router.post('/organization/login', authController.organizationLogin);

module.exports = router;
