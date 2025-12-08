const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  department_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  department_name: {
    type: String,
    required: true
  },
  parent_department_id: {
    type: String,
    ref: 'Department',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

DepartmentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Department', DepartmentSchema);
