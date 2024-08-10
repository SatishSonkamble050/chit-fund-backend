const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // username: { type: String },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  role: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare hashed passwords
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
