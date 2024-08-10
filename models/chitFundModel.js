const mongoose = require('mongoose');

const chitFundSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  amount: Number,
  duration: Number,
  installments: Number,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  transactions: [{
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    type: { type: String, enum: ['Contribution', 'Payout'] },
    date: Date,
    description: String,
  }],
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'] },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChitFund', chitFundSchema);
