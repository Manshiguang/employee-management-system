const Role = require('../models/Role');
const { generateRoleId } = require('../utils/idGenerator');

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ role_id: req.params.id });
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new role
const createRole = async (req, res) => {
  try {
    const { role_name, permissions } = req.body;
    
    // Check if role with same name already exists
    const existingRole = await Role.findOne({ role_name });
    if (existingRole) {
      return res.status(400).json({ error: 'Role with this name already exists' });
    }
    
    // Generate role ID
    const role_id = generateRoleId();
    
    // Create new role
    const role = new Role({
      role_id,
      role_name,
      permissions
    });
    
    await role.save();
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find role
    const role = await Role.findOne({ role_id: id });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Update role
    Object.assign(role, updates);
    await role.save();
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find role
    const role = await Role.findOne({ role_id: id });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Check if role is assigned to any users
    // (This would require adding a reference from User to Role, which we can implement later)
    
    // Delete role
    await role.deleteOne();
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
