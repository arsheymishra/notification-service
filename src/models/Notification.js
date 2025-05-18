import { Schema, model } from 'mongoose';

/**
 * Notification Schema
 * Stores information about notifications sent to users
 */
const NotificationSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  type: { 
    type: String, 
    required: true,
    enum: ['email', 'sms', 'in-app'],
    index: true
  },
  message: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    default: 'Notification' // Used for email notifications
  },
  recipient: { 
    type: String, 
    default: null // Email address or phone number
  },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
    index: true 
  },
  attempts: { 
    type: Number, 
    default: 0 
  },
  metadata: { 
    type: Map, 
    of: String, 
    default: {} 
  },
  readAt: { 
    type: Date, 
    default: null // When the notification was read (for in-app notifications)
  }
}, { 
  timestamps: true
});

NotificationSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default model('Notification', NotificationSchema);
