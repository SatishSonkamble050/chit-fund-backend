const User = require('../models/userModel');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('organizationId', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('organizationId', 'name');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  console.log("DATA : ", req.body)
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get users by organization ID
exports.getUsersByOrganizationId = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const users = await User.find({ organizationId: organizationId }).populate('organizationId', 'name');
    if (users.length === 0) return res.status(404).json({ msg: 'No users found for this organization' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
