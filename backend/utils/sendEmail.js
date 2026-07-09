const nodemailer = require('nodemailer');

/**
 * Sends an email using Gmail SMTP.
 * Falls back to mock console output if process.env.EMAIL_PASS is not configured.
 * 
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 */
const sendEmail = async ({ to, subject, text, html }) => {
    const fromUser = process.env.EMAIL_USER || '1dbnadmindtuncc@gmail.com';
    const emailPass = process.env.EMAIL_PASS;

    if (!emailPass || emailPass.trim() === '') {
        console.warn('Warning: EMAIL_PASS is not set in backend/.env. Running email in MOCK MODE.');
        console.log('\x1b[33m%s\x1b[0m', '=================== MOCK EMAIL SENT ===================');
        console.log(`From: ${fromUser}`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body (Text): ${text}`);
        if (html) {
            console.log(`Body (HTML): ${html}`);
        }
        console.log('\x1b[33m%s\x1b[0m', '======================================================');
        return { mock: true, recipient: to };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: fromUser,
                pass: emailPass
            }
        });

        const mailOptions = {
            from: `"1 DBN NCC Unit" <${fromUser}>`,
            to,
            subject,
            text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
};

module.exports = sendEmail;
