const nodemailer = require("nodemailer");
const logger = require("winston");
const { EMAIL_LOGS } = require("../app/logs/model/logModal");
// const CONTACT_US = require("../app/contactUs/model/contactUsModel");
const { CONST } = require("../helpers/constant");
// const SMTP = require("../app/SMTPsettings/model/smtpModel");
const {
  FORGOT_PASSWORD_OTP,
  WELCOME_EMAIL_TEMPLATE,
  RESEND_OTP,
  ACCOUNT_VERIFICATION_TEMPLATE,
  USER_QUERY,
  NEW_PROPERTY,
} = require("../helpers/email_template");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  async sendMail(to, subject, html, typeId) {
    // const smtp = await SMTP.findOne({ state: CONST.ACTIVE });
    const smtp = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      email: process.env.SMTP_AUTH_EMAIL,
      password: process.env.SMTP_AUTH_PASSWORD,
    };

    const transporter = nodemailer.createTransport({
      // create smtp protocol values
      host: smtp.host,
      port: smtp.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
    });

    let mailOptions = {
      // set data for mail options
      from: smtp.email,
      to: to,
      subject: subject,
      html: html,
    };

    return new Promise(function (resolve, reject) {
      // use send mail function to send mail to other user
      transporter.sendMail(mailOptions, async (err, res) => {
        if (err) {
          reject(Error(err.Error));
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.FAILED,
            typeId: typeId,
          }).save();
          resolve(null);
        } else {
          // else send success into resolve
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.SUCCESS,
            typeId: typeId,
          }).save();
          resolve(0);
        }
      });
    });
  },

  async forgotPassword(email, username, otp) {
    const subject = "Otp for reset password";
    const html = FORGOT_PASSWORD_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async resendOtp(email, username, otp) {
    const subject = "Resend otp for reset password";
    const html = RESEND_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async signUp(email, username, otp) {
    const subject = "Verify Email !";
    const html = ACCOUNT_VERIFICATION_TEMPLATE(email, username, otp);
    const sendMail = this.sendMail(email, subject, html);
  },

  async welcomeMail(email, username) {
    const subject = "Welcome email";
    const html = WELCOME_EMAIL_TEMPLATE(username);
    const sendMail = this.sendMail(email, subject, html);
  },

  async sendQuery(email, username, agentName, agentEmail, mobile, message,propertyId) {
    const subject = "User query regarding property !";
    const html = USER_QUERY(username, agentName, email, mobile, message,propertyId);
    const typeId = CONST.QUERY;
    const sendMail = this.sendMail(agentEmail, subject, html, typeId);
  },

  async addProperty(email) {
    const subject = "New property addedd !";
    const html = NEW_PROPERTY();
    const sendMail = this.sendMail(email, subject, html);
  },
};
