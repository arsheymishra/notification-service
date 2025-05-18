import express from 'express';
import { createNotification, getUserNotifications } from '../controllers/notificationController.js';

const router = express.Router();


router.post('/notifications', createNotification);
router.get('/users/:id/notifications', getUserNotifications);
router.get('/notifications/types', (req, res) => {
  res.json({
    types: ['email', 'sms', 'in-app'],
    description: 'Supported notification types'
  });
});

export default router;
