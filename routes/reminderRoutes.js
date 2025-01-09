// backend/routes/reminderRoutes.js
import express from 'express';
import { sendReminder, sendFeedbackRequest } from '../controllers/reminderController.js';

const router = express.Router();

// API endpoint to send reminders after 90 days
router.post('/sendReminder/:userId', sendReminder);

// API endpoint to send feedback request after 10 days
router.post('/sendFeedbackRequest/:userId', sendFeedbackRequest);

export default router;
