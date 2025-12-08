const Employee = require('../models/Employee');
const EmployeeChangeHistory = require('../models/EmployeeChangeHistory');
const { generateEmployeeId, generateHistoryId } = require('../utils/idGenerator');

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department_id group_leader_id team_leader_id created_by updated_by');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employee_id: req.params.id })
      .populate('department_id group_leader_id team_leader_id created_by updated_by');
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, department_id, group_leader_id, team_leader_id, id_card_number, oa_account, hire_date, performance } = req.body;
    
    // Check if employee with same ID card already exists
    const existingEmployee = await Employee.findOne({ id_card_number });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this ID card already exists' });
    }
    
    // Generate employee ID
    const employee_id = generateEmployeeId();
    
    // Create new employee
    const employee = new Employee({
      employee_id,
      name,
      department_id,
      group_leader_id,
      team_leader_id,
      id_card_number,
      oa_account,
      hire_date: hire_date ? new Date(hire_date) : null,
      performance,
      created_by: req.user.user_id,
      updated_by: req.user.user_id
    });
    
    await employee.save();
    
    // Create change history
    const history = new EmployeeChangeHistory({
      history_id: generateHistoryId(),
      employee_id,
      change_type: '新增',
      changed_by: req.user.user_id,
      field_name: 'employee',
      new_value: JSON.stringify(employee.toObject())
    });
    
    await history.save();
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find employee
    const employee = await Employee.findOne({ employee_id: id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Save original employee data for history
    const originalData = employee.toObject();
    
    // Update employee
    Object.assign(employee, updates);
    employee.updated_by = req.user.user_id;
    
    await employee.save();
    
    // Create change history for each updated field
    for (const field in updates) {
      if (originalData[field] !== updates[field]) {
        const history = new EmployeeChangeHistory({
          history_id: generateHistoryId(),
          employee_id: id,
          change_type: '修改',
          changed_by: req.user.user_id,
          field_name: field,
          old_value: originalData[field] ? originalData[field].toString() : null,
          new_value: updates[field] ? updates[field].toString() : null
        });
        
        await history.save();
      }
    }
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find employee
    const employee = await Employee.findOne({ employee_id: id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Delete employee
    await employee.deleteOne();
    
    // Create change history
    const history = new EmployeeChangeHistory({
      history_id: generateHistoryId(),
      employee_id: id,
      change_type: '删除',
      changed_by: req.user.user_id,
      field_name: 'employee',
      old_value: JSON.stringify(employee.toObject())
    });
    
    await history.save();
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get employee change history
const getEmployeeHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const history = await EmployeeChangeHistory.find({ employee_id: id })
      .populate('changed_by')
      .sort({ changed_at: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeHistory
};
