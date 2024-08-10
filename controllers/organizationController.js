const Organization = require('../models/organizationModel');

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get organization by ID
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ msg: 'Organization not found' });
    res.json(organization);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new organization
exports.createOrganization = async (req, res) => {
  try {
    const newOrganization = new Organization(req.body);
    const savedOrganization = await newOrganization.save();
    res.json(savedOrganization);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update an organization
exports.updateOrganization = async (req, res) => {
  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrganization) return res.status(404).json({ msg: 'Organization not found' });
    res.json(updatedOrganization);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete an organization
exports.deleteOrganization = async (req, res) => {
  try {
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.id);
    if (!deletedOrganization) return res.status(404).json({ msg: 'Organization not found' });
    res.json({ msg: 'Organization deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
