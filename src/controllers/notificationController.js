import Notification from '../models/Notification.js';
import { producer } from '../config/kafka.js';

/**
 * Create a new notification and queue it for processing
 * @route POST /notifications
 */
export const createNotification = async (req, res) => {
  try {
    const { userId, type, message, recipient } = req.body;
    
    // Validate required fields
    if (!userId || !type || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        requiredFields: ['userId', 'type', 'message'] 
      });
    }
    
    // Validate notification type
    const validTypes = ['email', 'sms', 'in-app'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid notification type', 
        validTypes 
      });
    }
    
    // Create notification in database
    const notification = await Notification.create({ 
      userId, 
      type, 
      message,
      recipient: recipient || null // Optional recipient field (email/phone)
    });
    
    // Queue notification for processing
    const payloads = [
      { topic: 'notifications', messages: JSON.stringify({ notificationId: notification._id }) },
    ];
    
    producer.send(payloads, (err, data) => {
      if (err) {
        console.error('Error sending to Kafka:', err);
        // Even if Kafka fails, we've stored the notification and can process it later
      } else {
        console.log('Message sent to Kafka:', data);
      }
    });
    
    // Return success response
    res.status(202).json({ 
      message: 'Notification queued for processing', 
      notificationId: notification._id,
      status: notification.status
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

/**
 * Get all notifications for a user
 * @route GET /users/:id/notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get notifications for user with optional filtering
    const query = { userId };
    
    // Allow filtering by status and type
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(req.query.limit ? parseInt(req.query.limit) : 100);
    
    res.json({
      userId,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
