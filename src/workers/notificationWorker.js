import { consumer } from '../config/kafka.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../services/emailService.js';
import { sendSMS } from '../services/smsService.js';
import { sendInAppNotification } from '../services/inAppService.js';

/**
 * Process notifications from Kafka queue
 * Handles different notification types and implements retry logic
 */
consumer.on('message', async (message) => {
  console.log('Received message from Kafka:', message.value);
  
  try {
    const { notificationId } = JSON.parse(message.value);
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      console.error(`Notification not found: ${notificationId}`);
      return;
    }
    
    console.log(`Processing notification ${notificationId} of type ${notification.type}`);
    
    let success = false;
    
    // Process based on notification type
    switch (notification.type) {
      case 'email':
        // In a real application, you would get the email from the user record
        success = await sendEmail('user@example.com', 'Notification', notification.message);
        break;
      case 'sms':
        // In a real application, you would get the phone number from the user record
        success = await sendSMS('1234567890', notification.message);
        break;
      case 'in-app':
        success = await sendInAppNotification(notification.userId, notification.message);
        break;
      default:
        console.error(`Unknown notification type: ${notification.type}`);
        notification.status = 'failed';
        notification.save();
        return;
    }
    
    if (success) {
      notification.status = 'sent';
      console.log(`Successfully processed notification ${notificationId}`);
    } else {
      // Increment attempt count and check if we should retry
      notification.attempts += 1;
      
      if (notification.attempts >= 3) {
        notification.status = 'failed';
        console.error(`Notification ${notificationId} failed after ${notification.attempts} attempts`);
      } else {
        notification.status = 'pending';
        console.log(`Will retry notification ${notificationId} (attempt ${notification.attempts})`);
        
        // Requeue the notification for retry after a delay
        // In a real application, you might use a more sophisticated retry strategy
        setTimeout(async () => {
          try {
            const payloads = [
              { topic: 'notifications', messages: JSON.stringify({ notificationId }) },
            ];
            
            // Import the producer from the same module
            const { producer } = await import('../config/kafka.js');
            producer.send(payloads, (err, data) => {
              if (err) {
                console.error('Error requeueing notification:', err);
              } else {
                console.log('Notification requeued for retry:', data);
              }
            });
          } catch (error) {
            console.error('Error in retry logic:', error);
          }
        }, 5000 * notification.attempts); // Exponential backoff
      }
    }
    
    await notification.save();
  } catch (error) {
    console.error('Error processing notification:', error);
  }
});

consumer.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});

console.log('Notification worker started and listening for messages');

