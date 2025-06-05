import express from 'express';
import { createVendorPayment, updateVendorPaymentStatus, getVendorBalances } from '../controllers/vendorPaymentController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authMiddleware, createVendorPayment);
router.post('/update-status', authMiddleware, updateVendorPaymentStatus);
router.get('/balances', authMiddleware, getVendorBalances);

export default router;
