const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  try {
    const msg = {
      ...data,
      from: 'angelika.gralewska@aol.com',
    }
  await sgMail.send(msg);
  } catch (error) {
   console.error(error);
    if (error.response) {
    console.error(error.response.body)
  }
  }
};

module.exports = { sendEmail };