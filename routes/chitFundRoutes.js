const express = require('express');
const router = express.Router();
const chitFundController = require('../controllers/chitFundController');
const authenticateToken = require('../middleware/authMiddleware')

router.get('/', chitFundController.getAllChitFunds);
router.get('/:id', chitFundController.getChitFundById);
router.post('/', chitFundController.createChitFund);
router.put('/:id', chitFundController.updateChitFund);
router.delete('/:id',authenticateToken, chitFundController.deleteChitFund);
router.get('/organization/:organizationId', chitFundController.getChitFundsByOrganization);
router.post('/add-member', chitFundController.addMemberToChitFund);
router.delete('/:chitFundId/member/:memberId', chitFundController.removeMemberFromChitFund);
router.get('/chit-fund-payments/:chitFundId', chitFundController.getChitFundPayments);
router.post('/member-payment-status', chitFundController.getMemberPaymentStatus);


module.exports = router;
