const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/authMiddleware');

// Create a new transaction (protected route)
router.post('/', authenticateToken, transactionController.createTransaction);

// Get all transactions (protected route)
router.get('/', authenticateToken, transactionController.getTransactions);

// Get a single transaction by ID (protected route)
router.get('/:id', authenticateToken, transactionController.getTransactionById);

// Update a transaction (protected route)
router.put('/:id', authenticateToken, transactionController.updateTransaction);

// Delete a transaction (protected route)
router.delete('/:id', authenticateToken, transactionController.deleteTransaction);

module.exports = router;
