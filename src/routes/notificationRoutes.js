import express from 'express';
import { createNotification, getUserNotifications } from '../controllers/notificationController.js';

const router = express.Router();

/**
 * @route POST /api/notifications
 * @description Create a new notification and queue it for processing
 * @access Public
 */
router.post('/notifications', createNotification);

/**
 * @route GET /api/users/:id/notifications
 * @description Get all notifications for a specific user
 * @access Public
 */
router.get('/users/:id/notifications', getUserNotifications);

/**
 * @route GET /api/notifications/types
 * @description Get all supported notification types
 * @access Public
 */
router.get('/notifications/types', (req, res) => {
  res.json({
    types: ['email', 'sms', 'in-app'],
    description: 'Supported notification types'
  });
});

export default router;
