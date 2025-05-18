import Notification from '../models/Notification.js';
import { producer } from '../config/kafka.js';


export const createNotification = async (req, res) => {
  try {
    const { userId, type, message, recipient } = req.body;
    
    if (!userId || !type || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        requiredFields: ['userId', 'type', 'message'] 
      });
    }
    
    const validTypes = ['email', 'sms', 'in-app'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid notification type', 
        validTypes 
      });
    }
    
    const notification = await Notification.create({ 
      userId, 
      type, 
      message,
      recipient: recipient || null 
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

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const query = { userId };
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
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
