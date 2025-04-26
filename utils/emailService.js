import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

export const sendReminderEmail = async (email, serviceTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: Service Follow-up for ${serviceTitle}`,
      text: `Dear Customer,\n\nIt has been 90 days since your last service (${serviceTitle}). We recommend scheduling a follow-up to ensure everything is working fine.\n\nBest Regards,\nYour Service Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
