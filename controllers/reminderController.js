import { sendPeerCall, sendFeedbackMessage } from './peerController.js';
import cron from 'node-cron';

// Send reminder message after 90 days
export const sendReminder = (req, res) => {
  const userId = req.params.userId;
  // Logic to check if the user is eligible for a reminder
  cron.schedule('0 0 0 1 1 */3', () => {
    sendPeerCall(userId, '90-day reminder call');
  });
  res.status(200).send('Reminder scheduled');
};

// Send feedback message after 10 days
export const sendFeedbackRequest = (req, res) => {
  const userId = req.params.userId;
  cron.schedule('0 0 0 1 1 */10', () => {
    sendFeedbackMessage(userId, 'Feedback request');
  });
  res.status(200).send('Feedback request scheduled');
};
