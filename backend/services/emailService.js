const nodemailer = require('nodemailer');

// Email Service Configuration
class EmailService {
    constructor() {
        // Using Gmail SMTP (you can change to any email provider)
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
    }

    // Send Welcome Email
    async sendWelcomeEmail(userEmail, userName) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@businessplatform.com',
            to: userEmail,
            subject: '🎉 Welcome to Multi-Business Platform!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4CAF50;">Welcome ${userName}! 🎉</h1>
                    <p>Thank you for joining our Multi-Business Platform!</p>
                    <p>You can now:</p>
                    <ul>
                        <li>🍛 Order from local tiffin centers</li>
                        <li>🛍️ Buy from various businesses</li>
                        <li>⭐ Rate and review products</li>
                        <li>🎁 Earn loyalty points</li>
                        <li>💰 Use promo codes for discounts</li>
                    </ul>
                    <p style="margin-top: 30px;">
                        <a href="http://localhost:5000" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            Start Shopping Now
                        </a>
                    </p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Happy Shopping!<br>
                        Multi-Business Platform Team
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Welcome email sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending welcome email:', error);
            return false;
        }
    }

    // Send Order Confirmation Email
    async sendOrderConfirmation(userEmail, userName, orderDetails) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@businessplatform.com',
            to: userEmail,
            subject: `🛍️ Order Confirmed - #${orderDetails._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4CAF50;">Order Confirmed! 🛍️</h1>
                    <p>Hi ${userName},</p>
                    <p>Your order has been confirmed and is being prepared.</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3>Order Details:</h3>
                        <p><strong>Order ID:</strong> #${orderDetails._id}</p>
                        <p><strong>Business:</strong> ${orderDetails.business?.name || 'N/A'}</p>
                        <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
                        <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                        <p><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
                        <p><strong>Status:</strong> ${orderDetails.status}</p>
                    </div>

                    <h3>Items Ordered:</h3>
                    <ul>
                        ${orderDetails.items.map(item => 
                            `<li>${item.product?.name || 'Product'} x ${item.quantity} = ₹${item.price * item.quantity}</li>`
                        ).join('')}
                    </ul>

                    <p style="margin-top: 30px;">
                        <a href="http://localhost:5000/api/orders/${orderDetails._id}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            Track Your Order
                        </a>
                    </p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Thank you for your order!<br>
                        Multi-Business Platform Team
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Order confirmation email sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending order confirmation:', error);
            return false;
        }
    }

    // Send Password Reset Email
    async sendPasswordResetEmail(userEmail, userName, resetToken) {
        const resetUrl = `http://localhost:5000/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@businessplatform.com',
            to: userEmail,
            subject: '🔐 Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #FF9800;">Password Reset Request 🔐</h1>
                    <p>Hi ${userName},</p>
                    <p>We received a request to reset your password.</p>
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #FF9800;">
                        <p><strong>⚠️ Security Notice:</strong></p>
                        <p>If you didn't request this password reset, please ignore this email.</p>
                        <p>This link will expire in 1 hour for security reasons.</p>
                    </div>

                    <p style="margin-top: 30px;">
                        <a href="${resetUrl}" style="background: #FF9800; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Your Password
                        </a>
                    </p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        If the button doesn't work, copy and paste this link:<br>
                        <a href="${resetUrl}">${resetUrl}</a>
                    </p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        Stay Safe!<br>
                        Multi-Business Platform Team
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Password reset email sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending password reset email:', error);
            return false;
        }
    }

    // Send Business Registration Approval Email
    async sendBusinessApprovalEmail(userEmail, businessName, isApproved) {
        const status = isApproved ? 'Approved' : 'Rejected';
        const color = isApproved ? '#4CAF50' : '#f44336';
        const icon = isApproved ? '✅' : '❌';
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@businessplatform.com',
            to: userEmail,
            subject: `${icon} Business Registration ${status}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: ${color};">Business Registration ${status} ${icon}</h1>
                    <p>Your business registration for <strong>${businessName}</strong> has been ${status.toLowerCase()}.</p>
                    
                    ${isApproved ? `
                        <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <p><strong>Congratulations! 🎉</strong></p>
                            <p>You can now start selling on our platform!</p>
                            <ul>
                                <li>Add your products</li>
                                <li>Manage orders</li>
                                <li>Track your earnings</li>
                                <li>Connect with customers</li>
                            </ul>
                        </div>
                        <p style="margin-top: 30px;">
                            <a href="http://localhost:5000/business-dashboard" style="background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
                                Go to Business Dashboard
                            </a>
                        </p>
                    ` : `
                        <div style="background: #f8d7da; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <p><strong>Registration Issues:</strong></p>
                            <p>Please contact our support team for more information about the rejection reason.</p>
                            <p>You can reapply after addressing the issues.</p>
                        </div>
                        <p style="margin-top: 30px;">
                            <a href="mailto:support@businessplatform.com" style="background: #f44336; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
                                Contact Support
                            </a>
                        </p>
                    `}
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Best regards,<br>
                        Multi-Business Platform Team
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Business ${status.toLowerCase()} email sent successfully`);
            return true;
        } catch (error) {
            console.error(`❌ Error sending business ${status.toLowerCase()} email:`, error);
            return false;
        }
    }

    // Send Promotional Email
    async sendPromotionalEmail(userEmail, userName, promoCode) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@businessplatform.com',
            to: userEmail,
            subject: '🎁 Special Offer Just for You!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #E91E63;">Special Offer! 🎁</h1>
                    <p>Hi ${userName},</p>
                    <p>We have an exclusive offer just for you!</p>
                    
                    <div style="background: linear-gradient(45deg, #E91E63, #FF5722); color: white; padding: 25px; border-radius: 15px; text-align: center; margin: 20px 0;">
                        <h2 style="margin: 0;">🏷️ Use Code: ${promoCode.code}</h2>
                        <p style="font-size: 18px; margin: 10px 0;">Get ${promoCode.discountPercentage}% OFF</p>
                        <p style="margin: 0;">on your next order!</p>
                    </div>

                    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3>Offer Details:</h3>
                        <p><strong>Discount:</strong> ${promoCode.discountPercentage}% OFF</p>
                        <p><strong>Maximum Discount:</strong> ₹${promoCode.maxDiscount}</p>
                        <p><strong>Minimum Order:</strong> ₹${promoCode.minOrderAmount}</p>
                        <p><strong>Valid Until:</strong> ${new Date(promoCode.expiryDate).toLocaleDateString()}</p>
                    </div>

                    <p style="margin-top: 30px; text-align: center;">
                        <a href="http://localhost:5000" style="background: #E91E63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                            Shop Now & Save!
                        </a>
                    </p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Hurry! Limited time offer.<br>
                        Multi-Business Platform Team
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Promotional email sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending promotional email:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
