const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    //our mail service which will send email creds
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    logger: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Izuku Midoria <hello@izuku.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  const info = await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
