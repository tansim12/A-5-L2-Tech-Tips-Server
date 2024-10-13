import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config()
export const emailSender = async (to: string, html: string) => {
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: process.env.NODE_ENV === 'production',
    auth: {
     
      user: 'tansimahmedtasjid@gmail.com',
      pass: 'vwev axgg fnpf gsbq',
    },
  });

  await transporter.sendMail({
    from: 'tansimahmedtasjid@gmail.com', // sender address
    to, // list of receivers
    subject: 'Tech & Tips Forget Password within 10 mins!', // Subject line
    text: 'Forget Password', // plain text body
    html, // html body
  });
};
