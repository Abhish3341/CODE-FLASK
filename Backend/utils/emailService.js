const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Initialize SES client
const ses = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const params = {
        Source: process.env.AWS_SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: 'Reset Your Password - CodeFlask'
            },
            Body: {
                Html: {
                    Data: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Reset Your Password</h2>
                            <p>You've requested to reset your password. Click the button below to proceed:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" 
                                   style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Reset Password
                                </a>
                            </div>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request this password reset, please ignore this email.</p>
                        </div>
                    `
                },
                Text: {
                    Data: `Reset your password by clicking: ${resetUrl}`
                }
            }
        }
    };

    try {
        const command = new SendEmailCommand(params);
        const response = await ses.send(command);
        console.log('Password reset email sent successfully:', response.MessageId);
        return response;
    } catch (error) {
        console.error('AWS SES error:', error);
        throw new Error('Failed to send reset email');
    }
};

module.exports = { sendResetEmail };