const nodemailer = require("nodemailer");
const { default_email, default_password } = require("../config/config");

exports.mailer = (userInfo) => {
  try {
    if (default_email) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        service: "gmail",
        secure: true,
        auth: {
          user: default_email,
          pass: default_password,
        },
      });

      async function main() {
        const info = await transporter.sendMail({
          from: "AllTimeFashions", // sender address
          to: userInfo.email, // list of receivers
          subject: `Hi, ${userInfo.username} - Welcome to sheriff`, // Subject line
          text: "Thank you for joining us..!", // plain text body
          html: `
        <h2>Thank you!</h2>

        <h3>Thanks for signing up. Welcome to our community. We are happy to have you on board.</h3>

        <p>Why don’t you follow us on [social media] as well?</p>
        <p>Regards,</p>
        <h2><b>sheriff</b></h2>`,
        });

        console.log("Message sent: %s", info.messageId);
      }

      main().catch(console.error);
    }
  } catch (error) {
    logger.error("Error while sending an email", error);
    console.log("Error while sending an email =>", error);
  }
};
