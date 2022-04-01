const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, logout } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;