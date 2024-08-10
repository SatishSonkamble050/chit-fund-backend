const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Deposit", "Withdrawal", "Prize"
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  chitFundId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChitFund', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true }, // Reference to Organization
  chitMonth: { type: Number, required: true }, // Month of the chit
  chitYear: { type: Number, required: true }, // Year of the chit
  paymentDate: { type: Date, required: true } // When the payment was made
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
