const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  CURRENT_URL: process.env.CURRENT_URL,
  GOOGLE_SIGNIN_CLIENT_ID: process.env.GOOGLE_SIGNIN_CLIENT_ID,
  GOOGLE_SIGNIN_SECRET_ID: process.env.GOOGLE_SIGNIN_SECRET_ID,
  NODEMAILER_EMAIL_ID: process.env.NODEMAILER_EMAIL_ID,
  NODEMAILER_PASS:process.env.NODEMAILER_PASS
};
