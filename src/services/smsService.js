// This is a mock implementation. In a real application, you would integrate with an SMS provider like Twilio
import axios from 'axios';

export const sendSMS = async (to, message) => {
    try {
        // In a real implementation, you would call an SMS API
        // Example with Twilio:
        // const response = await axios.post(
        //     `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        //     new URLSearchParams({
        //         To: to,
        //         From: process.env.TWILIO_PHONE_NUMBER,
        //         Body: message
        //     }),
        //     {
        //         auth: {
        //             username: process.env.TWILIO_ACCOUNT_SID,
        //             password: process.env.TWILIO_AUTH_TOKEN
        //         }
        //     }
        // );
        
        // For demo purposes, we'll just log the message
        console.log(`Successfully sent SMS to ${to}: ${message}`);
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
};