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

exports.ipApproved_mailer = (admin, email, idx) => {
  var projectName;
  var projectDescription;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log("Error in ipApprovedMail");
    }
    projectName = user["ipList"][idx]["projectName"];
    projectDescription = user["ipList"][idx]["projectDescription"];
    let htmlString = `
    <div>
        <p>Hi ${fetchStudentName(email)}!</p>
        <br>
        <p>Congratulations! Your No-Dues has been approved for the IP/IS/UR work under ${fetchProffName(
          admin
        )}.</p>
        <h5>Description: </h5>
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
        subject: `No-Dues Approved for IP/IS/UR under ${fetchProffName(admin)}`,
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
