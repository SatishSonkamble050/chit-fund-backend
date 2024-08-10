const User = require('../models/userModel');
const Organization = require('../models/organizationModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, 'hellobrother', { expiresIn: '1h' });
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Organization Login
exports.organizationLogin = async (req, res) => {
  try {
    const { adminUsername, adminPassword } = req.body;
    const organization = await Organization.findOne({ adminUsername });
    if (!organization) return res.status(404).json({ msg: 'Organization not found' });

    const isMatch = await organization.comparePassword(adminPassword);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(organization._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
