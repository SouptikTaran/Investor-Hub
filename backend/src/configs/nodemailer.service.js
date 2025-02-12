import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger.js';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_MAILER_USER, 
    pass: process.env.NODE_MAILER_PASSWORD, 
  },
});


export default async function sendEmail(sender , sub , text) {
  try { 
    const info = await transporter.sendMail({
      from: process.env.NODE_MAILER_USER, 
      to: sender,
      subject: sub, 
      text: text,
    });
  } catch (error) {
    logger.error('Error sending email:', error);
  }
}


