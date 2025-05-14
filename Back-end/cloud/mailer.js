const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: 'roohi420op@gmail.com',
    pass: 'gjuk qgfy mtxz xsgo'
  }
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: 'roohi420op@gmail.com',
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendMail };