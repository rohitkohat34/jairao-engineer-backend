import express from 'express';
import { getAdmins, loginAdmin, createAdmin } from '../controllers/adminLoginController.js';

const router = express.Router();

router.get('/all', getAdmins);           // Get all admins (debugging)
router.post('/login', loginAdmin);       // Admin login
router.post('/create', createAdmin);     // Admin creation (use only if needed)

export default router;
