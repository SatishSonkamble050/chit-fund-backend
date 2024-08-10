const Transaction = require('../models/transactionModel');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      type: req.body.type,
      amount: req.body.amount,
      chitFundId: req.body.chitFundId,
      userId: req.body.userId,
      organizationId: req.body.organizationId,
      chitMonth: req.body.chitMonth,
      chitYear: req.body.chitYear,
      paymentDate: req.body.paymentDate
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('chitFundId').populate('userId').populate('organizationId');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('chitFundId').populate('userId').populate('organizationId');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('chitFundId').populate('userId').populate('organizationId');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
