const ChitFund = require('../models/chitFundModel');
const User = require('../models/userModel')

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

