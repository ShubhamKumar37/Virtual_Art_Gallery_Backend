import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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