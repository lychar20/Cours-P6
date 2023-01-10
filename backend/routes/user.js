const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); // a verifier

router.post('/signup', userCtrl.signup); // a verifier
router.post('/login', userCtrl.login);  // a verifier a

module.exports = router; 