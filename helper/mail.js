import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: "Virtual Gallery <noreply@virtualgallery.com>",   
        to,
        subject,
        html: text
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;