import express from 'express';
import { getLineChartData, getBarChartData, getPieChartData } from "../controllers/chartController.js";

import authMiddleware from '../middleware/auth.js'; // Import the default export

const router = express.Router();

router.get('/line-chart', authMiddleware, getLineChartData);
router.get('/bar-chart', authMiddleware, getBarChartData);
router.get('/pie-chart', authMiddleware, getPieChartData);

export default router;
