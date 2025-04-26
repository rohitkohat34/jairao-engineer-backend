import express from 'express';
import { loginVendor } from '../controllers/loginController.js';

const router = express.Router();

router.post('/login', loginVendor);

export default router;
