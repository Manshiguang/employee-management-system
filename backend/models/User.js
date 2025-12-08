const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role_id: {
    type: String,
    ref: 'Role',
    required: true
  },
  department_id: {
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

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model('User', UserSchema);
