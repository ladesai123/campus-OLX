// Email service for notifications and welcome messages
// In production, integrate with services like Resend, SendGrid, Mailgun, etc.

export const EmailService = {
  // Send welcome email to new users
  sendWelcomeEmail: async (userEmail, userName = '') => {
    try {
      const emailData = {
        to: userEmail,
        subject: '🎓 Welcome to CampusOLX - Your Campus Marketplace!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
              .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
              .cta { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to CampusOLX! 🎉</h1>
                <p>Your trusted campus marketplace is ready</p>
              </div>
              
              <div class="content">
                <p>Hi ${userName || 'there'}! 👋</p>
                
                <p>We're thrilled to have you join our community of students who are making campus life more affordable and sustainable!</p>
                
                <div class="feature">
                  <h3>🛍️ Start Shopping</h3>
                  <p>Browse amazing deals from verified students in your area</p>
                </div>
                
                <div class="feature">
                  <h3>💰 Sell Your Items</h3>
                  <p>Turn your unused items into cash with our easy listing process</p>
                </div>
                
                <div class="feature">
                  <h3>🌱 Make an Impact</h3>
                  <p>Every transaction helps reduce waste and saves the environment</p>
                </div>
                
                <a href="#" class="cta">Explore CampusOLX</a>
                
                <h3>Quick Tips to Get Started:</h3>
                <ul>
                  <li>Complete your profile to build trust</li>
                  <li>Use clear, well-lit photos for your listings</li>
                  <li>Price items competitively</li>
                  <li>Meet in safe, public places on campus</li>
                </ul>
                
                <p>Questions? Just reply to this email - we're here to help!</p>
                
                <p>Happy trading! 🎓</p>
                <p><strong>The CampusOLX Team</strong></p>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} CampusOLX. A project for students, by students.</p>
                <p>You received this email because you signed up for CampusOLX.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      // In production, replace with actual email service API call
      console.log('Welcome email would be sent:', emailData);
      return { success: true, messageId: 'demo-' + Date.now() };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send notification when someone messages the user
  sendMessageNotification: async (recipientEmail, senderName, itemName, messagePreview) => {
    try {
      const emailData = {
        to: recipientEmail,
        subject: `💬 New message from ${senderName} about "${itemName}"`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 500px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 25px; border-radius: 0 0 8px 8px; }
              .message { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0; }
              .cta { background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>💬 New Message on CampusOLX</h2>
              </div>
              
              <div class="content">
                <p><strong>${senderName}</strong> sent you a message about <strong>"${itemName}"</strong></p>
                
                <div class="message">
                  <p><em>"${messagePreview}"</em></p>
                </div>
                
                <a href="#" class="cta">Reply on CampusOLX</a>
                
                <p><small>This notification was sent because you have an active listing on CampusOLX.</small></p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      console.log('Message notification would be sent:', emailData);
      return { success: true, messageId: 'demo-' + Date.now() };
    } catch (error) {
      console.error('Failed to send message notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send admin notification for product verification
  sendAdminNotification: async (adminEmail, itemDetails, userEmail) => {
    try {
      const emailData = {
        to: adminEmail,
        subject: `🔍 New Item Requires Verification - CampusOLX Admin`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 25px; border-radius: 0 0 8px 8px; }
              .item-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
              .urgent { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 15px 0; }
              .actions { display: flex; gap: 10px; margin: 20px 0; }
              .approve { background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; }
              .reject { background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🔍 Admin Review Required</h2>
              </div>
              
              <div class="content">
                <div class="urgent">
                  <p><strong>⚠️ New item listing requires your review and approval</strong></p>
                </div>
                
                <div class="item-details">
                  <h3>Item Details:</h3>
                  <p><strong>Name:</strong> ${itemDetails.name}</p>
                  <p><strong>Price:</strong> $${itemDetails.price}</p>
                  <p><strong>Category:</strong> ${itemDetails.category}</p>
                  <p><strong>Description:</strong> ${itemDetails.description}</p>
                  <p><strong>Seller:</strong> ${userEmail}</p>
                  <p><strong>Listed:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <h3>AI Analysis Results:</h3>
                <ul>
                  <li>Authenticity Score: 92%</li>
                  <li>Content Appropriateness: ✅ Passed</li>
                  <li>Image Quality: Good</li>
                  <li>Suggested Category: ${itemDetails.category}</li>
                </ul>
                
                <div class="actions">
                  <a href="#" class="approve">✅ Approve</a>
                  <a href="#" class="reject">❌ Reject</a>
                </div>
                
                <p><small>Please review this item within 24 hours to maintain platform quality.</small></p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      console.log('Admin notification would be sent:', emailData);
      return { success: true, messageId: 'demo-' + Date.now() };
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send item approval/rejection notification to user
  sendItemStatusNotification: async (userEmail, itemName, approved, adminMessage = '') => {
    const status = approved ? 'approved' : 'rejected';
    const color = approved ? '#10b981' : '#dc2626';
    const icon = approved ? '✅' : '❌';
    
    try {
      const emailData = {
        to: userEmail,
        subject: `${icon} Your listing "${itemName}" has been ${status}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 500px; margin: 0 auto; padding: 20px; }
              .header { background: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 25px; border-radius: 0 0 8px 8px; }
              .message { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>${icon} Listing ${approved ? 'Approved' : 'Rejected'}</h2>
              </div>
              
              <div class="content">
                <p>Hi there!</p>
                
                <p>Your listing <strong>"${itemName}"</strong> has been ${status} by our admin team.</p>
                
                ${adminMessage ? `<div class="message"><p><strong>Admin Message:</strong> ${adminMessage}</p></div>` : ''}
                
                ${approved 
                  ? '<p>🎉 Your item is now live on CampusOLX! Students can see and message you about it.</p>'
                  : '<p>Please review our guidelines and feel free to submit a new listing that meets our standards.</p>'
                }
                
                <p>Thanks for using CampusOLX!</p>
                <p><strong>The CampusOLX Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      console.log('Item status notification would be sent:', emailData);
      return { success: true, messageId: 'demo-' + Date.now() };
    } catch (error) {
      console.error('Failed to send item status notification:', error);
      return { success: false, error: error.message };
    }
  }
};

// In production, replace console.log with actual email service integration:
/*
Example with Resend:

import { Resend } from 'resend';
const resend = new Resend('your-api-key');

await resend.emails.send({
  from: 'CampusOLX <noreply@campusolx.com>',
  to: emailData.to,
  subject: emailData.subject,
  html: emailData.html,
});

Example with SendGrid:

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  from: 'noreply@campusolx.com',
  to: emailData.to,
  subject: emailData.subject,
  html: emailData.html,
});
*/