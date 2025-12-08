const Department = require('../models/Department');
const { generateDepartmentId } = require('../utils/idGenerator');

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('parent_department_id');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findOne({ department_id: req.params.id })
      .populate('parent_department_id');
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const { department_name, parent_department_id, department_level } = req.body;
    
    // Check if department with same name already exists
    const existingDepartment = await Department.findOne({ department_name });
    if (existingDepartment) {
      return res.status(400).json({ error: 'Department with this name already exists' });
    }
    
    // Generate department ID
    const department_id = generateDepartmentId();
    
    // Create new department
    const department = new Department({
      department_id,
      department_name,
      parent_department_id,
      department_level
    });
    
    await department.save();
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find department
    const department = await Department.findOne({ department_id: id });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Update department
    Object.assign(department, updates);
    await department.save();
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find department
    const department = await Department.findOne({ department_id: id });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    // Check if department has employees
    // (This would require adding a reference from Employee to Department, which we can implement later)
    
    // Delete department
    await department.deleteOne();
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
