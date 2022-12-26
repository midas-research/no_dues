const nodemailer = require("../config/nodemailer");
const axios = require("axios");
const { CURRENT_URL, NODEMAILER_EMAIL_ID } = require("../config/config");
const User = require("../models/user");
const Admin = require("../models/admin");

function fetchName(email) {
  var index = email.indexOf("@");
  var name = email.substring(0, index - 5);
  return name[0].toUpperCase() + name.substring(1);
}

exports.newMessage = async (message, email, admin) => {
  Admin.db.findOne({ admin: admin }, function (err, adminObj) {
    if (err) {
      console.log("Can't find admin");
    }

    let displayAddress = adminObj["displayAddress"];
    if (displayAddress == "") {
      displayAddress = "NA";
    }

    let htmlString = `
    <div>
        <p>Hi ${fetchName(email)}!</p>
        <br>
        <p>You have received the following message regarding your dues in the ${
          adminObj["originalAdminName"]
        } department.</p>
        <br>
        <p> No Dues Rejected!</p>
        <p>Message - ${message}</p>
        <br>
        <p>Thanks!</p>
        <p>${adminObj["displayName"]}</p>
        <p>[${displayAddress}]</p>
    </div>`;

    nodemailer.transporter.sendMail(
      {
        from: `${NODEMAILER_EMAIL_ID}`,
        to: email,
        subject: `No Dues Rejected for ${adminObj["originalAdminName"]} Department`,
        html: htmlString,
      },
      (err, info) => {
        if (err) {
          console.log("Error in sending mail", err);
          return;
        }
        return;
      }
    );

    return adminObj;
  });
};
