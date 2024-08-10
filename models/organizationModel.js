const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String },
  contactEmail: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  adminUsername: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
}, { timestamps: true });

// Hash the admin password before saving
OrganizationSchema.pre('save', async function (next) {
  if (!this.isModified('adminPassword')) return next();
  const salt = await bcrypt.genSalt(10);
  this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
  next();
});

// Compare hashed passwords
OrganizationSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.adminPassword);
};

module.exports = mongoose.model('Organization', OrganizationSchema);
