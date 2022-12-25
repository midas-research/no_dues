const nodemailer = require("../config/nodemailer");
const { NODEMAILER_EMAIL_ID } = require("../config/config");
const User = require("../models/user");
function fetchStudentName(email) {
  var index = email.indexOf("@");
  var name = email.substring(0, index - 5);
  return name[0].toUpperCase() + name.substring(1);
}

function fetchProffName(email) {
  var index = email.indexOf("@");
  var name = email.substring(0, index);
  return name[0].toUpperCase() + name.substring(1);
}

exports.sendIpMessage_mailer = (message, email, admin, idx) => {
  var projectName;
  var projectDescription;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log("Error in ipSendMessage");
    }
    projectName = user["ipList"][idx]["projectName"];
    projectDescription = user["ipList"][idx]["projectDescription"];
    let htmlString = `
    <div>
        <p>Hi ${fetchStudentName(email)}!</p>
        <br>
        <p>You have received the following message regarding your dues in the IP/IS/UR under ${fetchProffName(
          admin
        )}.</p>
        <br>
        <p>Message - ${message}</p>

        <h5>Description of Project: </h5>
            <ul>
                <li>Project Name: ${projectName}</li>
                <li>Project Description: ${projectDescription}</li>
            </ul>
        <br>
        <p>Thanks No-Dues!</p>
    </div>`;
    nodemailer.transporter.sendMail(
      {
        from: `${NODEMAILER_EMAIL_ID}`,
        to: email,
        subject: `No-Dues Rejected for IP/IS/UR under ${fetchProffName(admin)}`,
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
  });
};
