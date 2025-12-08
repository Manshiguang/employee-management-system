const crypto = require('crypto');

// Generate unique ID with prefix and timestamp
const generateId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(6).toString('hex');
  return `${prefix}-${timestamp}-${random}`;
};

// Generate specific IDs
const generateEmployeeId = () => generateId('EMP');
const generateDepartmentId = () => generateId('DEP');
const generateUserId = () => generateId('USR');
const generateRoleId = () => generateId('ROL');
const generateHistoryId = () => generateId('HIS');

module.exports = {
  generateEmployeeId,
  generateDepartmentId,
  generateUserId,
  generateRoleId,
  generateHistoryId,
  generateId
};
