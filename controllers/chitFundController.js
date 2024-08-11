const ChitFund = require('../models/chitFundModel');
const User = require('../models/userModel')
const Transaction = require('../models/transactionModel');
const moment = require('moment');

// Get all chit funds
exports.getAllChitFunds = async (req, res) => {
  try {
    const chitFunds = await ChitFund.find().populate('organizationId', 'name');
    res.json(chitFunds);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get chit fund by ID
exports.getChitFundById = async (req, res) => {
  try {
    const chitFund = await ChitFund.findById(req.params.id)
      .populate('organizationId', 'name')
      .populate('members', 'username')
      .exec();
    if (!chitFund) return res.status(404).json({ msg: 'Chit fund not found' });
    res.json(chitFund);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new chit fund
exports.createChitFund = async (req, res) => {
  try {
    const newChitFund = new ChitFund(req.body);
    const savedChitFund = await newChitFund.save();
    res.json(savedChitFund);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a chit fund
exports.updateChitFund = async (req, res) => {
  try {
    const updatedChitFund = await ChitFund.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedChitFund) return res.status(404).json({ msg: 'Chit fund not found' });
    res.json(updatedChitFund);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a chit fund
exports.deleteChitFund = async (req, res) => {
  try {
    const deletedChitFund = await ChitFund.findByIdAndDelete(req.params.id);
    if (!deletedChitFund) return res.status(404).json({ msg: 'Chit fund not found' });
    res.json({ msg: 'Chit fund deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



exports.getChitFundsByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    // Fetch chit funds and populate member data
    const chitFunds = await ChitFund.find({ organizationId })
      .populate({
        path: 'members', // Assuming 'members' is an array of objects with '_id' as User references
        select: 'firstName email', // Select specific fields to return
      });

    if (!chitFunds.length) {
      return res.status(404).json({ message: 'No chit funds found for this organization' });
    }

    res.status(200).json(chitFunds);
  } catch (error) {
    console.error('Error fetching chit funds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Add a member to a chit fund
exports.addMemberToChitFund = async (req, res) => {
  try {
    const { chitFundId, memberId, contribution } = req.body;

    // Find the chit fund by ID
    const chitFund = await ChitFund.findById(chitFundId);
    if (!chitFund) {
      return res.status(404).json({ message: 'Chit fund not found' });
    }

    // Find the user by ID
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already a member of the chit fund
    if (chitFund.members.some(member => member._id.toString() === memberId)) {
      return res.status(400).json({ message: 'User is already a member of this chit fund' });
    }

    // Add the member to the chit fund
    chitFund.members.push({
      _id: memberId,
      contribution: contribution,
    });

    // Save the chit fund
    await chitFund.save();

    res.status(200).json({ message: 'Member added successfully', chitFund });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove the member from the chit fund--------------------------
exports.removeMemberFromChitFund = async (req, res) => {
  try {
    const { chitFundId, memberId } = req.params;

    // Find the ChitFund and remove the member
    const chitFund = await ChitFund.findByIdAndUpdate(
      chitFundId,
      { $pull: { members: memberId } }, // Remove the member ID from the members array
      { new: true } // Return the updated document
    );

    if (!chitFund) {
      return res.status(404).json({ message: 'Chit Fund not found' });
    }

    res.status(200).json(chitFund);
  } catch (error) {
    console.error('Error removing member from Chit Fund:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get payment and due amounts by month and year for a Chit Fund
exports.getChitFundPayments = async (req, res) => {
  try {
    const { chitFundId } = req.params;

    // Step 1: Find Chit Fund
    const chitFund = await ChitFund.findById(chitFundId);
    if (!chitFund) return res.status(404).json({ message: 'Chit Fund not found' });

    const { startDate, endDate, amount } = chitFund;
    const start = moment(startDate);
    const end = moment(endDate);

    // Step 2: Get Transactions within the range
    const transactions = await Transaction.find({
      chitFundId: chitFundId,
      paymentDate: { $gte: start.toDate(), $lte: end.toDate() }
    });


    // Prepare a map to hold payment data by month and year
    const paymentData = {};

    // Aggregate transactions
    transactions.forEach(transaction => {
      const monthYearKey = `${transaction.chitMonth}-${transaction.chitYear}`;
      if (!paymentData[monthYearKey]) {
        paymentData[monthYearKey] = { paidAmount: 0, dueAmount: amount };
      }
      paymentData[monthYearKey].paidAmount += transaction.amount;
      paymentData[monthYearKey].dueAmount -= transaction.amount;
    });

  
    // Step 3: Generate response data
    const response = [];
    let current = moment(start);
    while (current <= end) {
      const monthYearKey = `${current.month() + 1}-${current.year()}`;
      response.push({
        month: current.format('MMMM'),
        chitFundId : chitFundId,
        userId : current.userId,
        year: current.year(),
        paidAmount: paymentData[monthYearKey] ? paymentData[monthYearKey].paidAmount : 0,
        dueAmount: paymentData[monthYearKey] ? paymentData[monthYearKey].dueAmount : amount
      });
      current.add(1, 'month');
    }

    // Step 4: Send Response
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching chit fund payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get member payment status
exports.getMemberPaymentStatus = async (req, res) => {
  try {
    const { chitFundId, month, year } = req.body;
    

    // Ensure parameters are being passed correctly
    if (!chitFundId || !month || !year) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Find Chit Fund
    const chitFund = await ChitFund.findById(chitFundId).populate('members');

    if (!chitFund) return res.status(404).json({ message: 'Chit Fund not found' });

    // Retrieve Members
    const memberIds = chitFund.members.map(member => member._id);
  

    // Fetch Transactions
    const transactions = await Transaction.find({
      chitFundId: chitFundId,
      chitMonth: month,
      chitYear: year
    });

  

    // Create Map for Transactions
    const transactionsMap = {};
    transactions.forEach(transaction => {
      transactionsMap[transaction.userId] = {
        amount: transaction.amount,
        paymentDate: transaction.paymentDate,
      };
    });

    // Determine Payment Status
    const memberStatuses = await Promise.all(chitFund.members.map(async (member) => {
      const transaction = transactionsMap[member._id] || {};
      return {
        name: member.firstName,
        id: member._id,
        paidStatus: transaction.amount ? 'Paid' : 'Not Paid',
        paidAmount: transaction.amount || 0,
        paidDate: transaction.paymentDate || null
      };
    }));

    // Send Response
    res.status(200).json({
      organizationId: chitFund.organizationId,  // Assuming chitFund has an organizationId field
      chitFundName: chitFund.name,
      chitId : chitFund._id,              // Assuming chitFund has a name field
      memberStatuses
    });
  } catch (error) {
    console.error('Error fetching member payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


