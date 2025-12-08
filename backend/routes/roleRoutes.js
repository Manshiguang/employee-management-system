const express = require('express');
const router = express.Router();
const { 
  getRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole 
} = require('../controllers/roleController');
const auth = require('../middlewares/auth');

// @route   GET /api/roles
// @desc    Get all roles
// @access  Private
router.get('/', auth, getRoles);

// @route   GET /api/roles/:id
// @desc    Get role by ID
// @access  Private
router.get('/:id', auth, getRoleById);

// @route   POST /api/roles
// @desc    Create new role
// @access  Private
router.post('/', auth, createRole);

// @route   PUT /api/roles/:id
// @desc    Update role
// @access  Private
router.put('/:id', auth, updateRole);

// @route   DELETE /api/roles/:id
// @desc    Delete role
// @access  Private
router.delete('/:id', auth, deleteRole);

module.exports = router;
