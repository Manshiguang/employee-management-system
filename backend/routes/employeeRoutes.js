const express = require('express');
const router = express.Router();
const { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  getEmployeeHistory 
} = require('../controllers/employeeController');
const auth = require('../middlewares/auth');

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, getEmployees);

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, getEmployeeById);

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private
router.post('/', auth, createEmployee);

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', auth, updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', auth, deleteEmployee);

// @route   GET /api/employees/:id/history
// @desc    Get employee change history
// @access  Private
router.get('/:id/history', auth, getEmployeeHistory);

module.exports = router;
