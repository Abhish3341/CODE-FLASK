const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Initialize SES client with error handling
const ses = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    maxAttempts: 3 // Add retry logic
});

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const sendResetEmail = async (email, resetToken) => {
    // Input validation
    if (!email || !resetToken) {
        throw new Error('Email and reset token are required');
    }
    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
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
        // Add timeout and retry mechanism
        const command = new SendEmailCommand(params);
        const response = await Promise.race([
            ses.send(command),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Email send timeout')), 10000)
            )
        ]);

        console.log('Password reset email sent successfully:', response.MessageId);
        return {
            success: true,
            messageId: response.MessageId,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('AWS SES error:', {
            message: error.message,
            code: error.code,
            time: new Date().toISOString()
        });
        throw new Error(
            error.code === 'TimeoutError' 
                ? 'Email service timeout' 
                : 'Failed to send reset email'
        );
    }
};

module.exports = { sendResetEmail };