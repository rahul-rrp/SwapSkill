const nodemailer = require("nodemailer");

const sendEmail = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // use 465 with secure: true if SSL
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"SwapSkill" <${process.env.MAIL_USER}>`, // must be a real email
      to: email,
      subject: title,
      html: body,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
