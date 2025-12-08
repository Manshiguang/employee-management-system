const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  name: {
    type: String,
    required: true
  },
  department_id: {
    type: String,
    ref: 'Department',
    required: true
  },
  group_leader_id: {
    type: String,
    ref: 'Employee',
    default: null
  },
  team_leader_id: {
    type: String,
    ref: 'Employee',
    default: null
  },
  id_card_number: {
    type: String,
    required: true,
    unique: true
  },
  oa_account: {
    type: String,
    unique: true,
    default: null
  },
  hire_date: {
    type: Date,
    default: null
  },
  termination_date: {
    type: Date,
    default: null
  },
  performance: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['在职', '离职', '休假'],
    default: '在职'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: String,
    ref: 'User',
    required: true
  }
});

EmployeeSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);
