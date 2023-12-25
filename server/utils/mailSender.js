const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (title, body, email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    });
    const mailResposne = await transporter.sendMail({
      to: `${email}`,
      from: "StudyNotion || Codehelp by Jaswini",
      subject: `${title}`,
      html: `${body}`,
    });
    console.log("mail response", mailResposne);
    return mailResposne;
  } catch (error) {
    console.log("error while sending mail", error);
  }
};

module.exports = mailSender;
