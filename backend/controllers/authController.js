const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/token');

// User login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { user_id: user.user_id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, user: {
      user_id: user.user_id,
      username: user.username,
      role_id: user.role_id,
      department_id: user.department_id
    }});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  login
};
