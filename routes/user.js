const express = require('express');
const { updateDetails, updatePassword } = require('../controllers/user');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;