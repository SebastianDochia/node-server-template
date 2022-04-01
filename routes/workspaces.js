const express = require('express');
const { getWorkspaces, getWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } = require("../controllers/workspaces");

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/').post(protect, authorize('professor', 'admin'), createWorkspace).get(protect, getWorkspaces);

router.route('/:id').get(protect, getWorkspace).put(protect, authorize('professor', 'admin'), updateWorkspace).delete(protect, authorize('professor', 'admin'), deleteWorkspace);

module.exports = router;