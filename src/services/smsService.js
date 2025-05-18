// This is a mock implementation. In a real application, you would integrate with an SMS provider
import axios from 'axios';

export const sendSMS = async (to, message) => {
    try {
        // In a real implementation, you would call an SMS API
        // For demo purposes, we'll just log the message
        console.log(`Successfully sent SMS to ${to}: ${message}`);
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
};