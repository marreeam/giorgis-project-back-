require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://${process.env.DOMAIN}/api/auth/verify/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email address',
    html: `Please verify your email by clicking on the following link: <a href="${verificationUrl}">Verify Email</a>`,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email: ${error}`);
      throw new Error(`Error sending email: ${error}`);
    } else {
      console.log(`Verification email sent: ${info.response}`);
    }
  });
};

// Function to send confirmation email
const sendConfirmationEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verified Successfully',
    html: `<p>Your email has been successfully verified. You can now log in to your account.</p>`,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email: ${error}`);
      throw new Error(`Error sending email: ${error}`);
    } else {
      console.log(`Confirmation email sent: ${info.response}`);
    }
  });
};

module.exports = { sendVerificationEmail, sendConfirmationEmail };
