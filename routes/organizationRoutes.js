const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const authenticateToken = require('../middleware/authMiddleware')

router.get('/', authenticateToken, organizationController.getAllOrganizations);
router.get('/:id',  authenticateToken, organizationController.getOrganizationById);
router.post('/', authenticateToken, organizationController.createOrganization);
router.put('/:id', authenticateToken, organizationController.updateOrganization);
router.delete('/:id',authenticateToken, organizationController.deleteOrganization);

module.exports = router;
