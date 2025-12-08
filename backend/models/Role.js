const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  role_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  role_name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    type: Array,
    required: true,
    default: []
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

RoleSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Role', RoleSchema);
