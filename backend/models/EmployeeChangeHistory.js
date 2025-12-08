const mongoose = require('mongoose');

const EmployeeChangeHistorySchema = new mongoose.Schema({
  history_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  employee_id: {
    type: String,
    ref: 'Employee',
    required: true
  },
  change_type: {
    type: String,
    enum: ['新增', '修改', '删除'],
    required: true
  },
  changed_by: {
    type: String,
    ref: 'User',
    required: true
  },
  changed_at: {
    type: Date,
    default: Date.now
  },
  field_name: {
    type: String,
    required: true
  },
  old_value: {
    type: String,
    default: null
  },
  new_value: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('EmployeeChangeHistory', EmployeeChangeHistorySchema);
