import nodemailer from 'nodemailer';

/**
 * Configure email transport
 * In production, you might want to use a service like SendGrid, Mailgun, or Amazon SES
 */
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 * @param {string} html - Optional HTML version of the email
 * @returns {Promise<boolean>} - Success status
 */
export const sendEmail = async (to, subject, text, html = null) => {
    // Validate email address format
    if (!to || !validateEmail(to)) {
        console.error('Invalid email address:', to);
        return false;
    }
    
    const mailOptions = {
        from: `"Notification Service" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    };
    
    // Add HTML content if provided
    if (html) {
        mailOptions.html = html;
    }
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

/**
 * Simple email validation function
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
