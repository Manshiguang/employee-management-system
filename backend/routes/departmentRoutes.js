const express = require('express');
const router = express.Router();
const { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} = require('../controllers/departmentController');
const auth = require('../middlewares/auth');

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', auth, getDepartments);

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Private
router.get('/:id', auth, getDepartmentById);

// @route   POST /api/departments
// @desc    Create new department
// @access  Private
router.post('/', auth, createDepartment);

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private
router.put('/:id', auth, updateDepartment);

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private
router.delete('/:id', auth, deleteDepartment);

module.exports = router;
