const nodemailer = require('../config/nodemailer');
const User = require('../models/user');
const {CURRENT_URL,NODEMAILER_EMAIL_ID}= require('../config/config');


function fetchStudentName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index-5);
    return name[0].toUpperCase() + name.substring(1,);
}

function fetchProffName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index);
    return name[0].toUpperCase() + name.substring(1,);
}

exports.sendBtpRequest = async (proffEmail, studentEmail,ProjectName,ProjectDescription) => {
    var student = await User.findOne({email: studentEmail});
   
    let url=`${CURRENT_URL}/btpApprovedMail/${proffEmail}/${student._id}`;
   
    let htmlString = `
    <div>
        <p>Hi ${fetchProffName(proffEmail)}!</p>
        <br>
        <p>You have received the following message requesting dues clearance for 
        BTP from ${fetchStudentName(studentEmail)} 
        (email - ${studentEmail}).</p>
        <h5>Description: </h5>
            <ul>
                <li>Project Name: ${ProjectName}</li>
                <li>Project Description: ${ProjectDescription}</li>
            </ul>
        <p>Click <a href=\`${url}\`>here</a> to approve the dues.</p>
        <p>Click <a href=\`${CURRENT_URL}/proff_home\`>here</a> to go to the portal and reject the dues.</p>
        <br>
        <p>Thanks No-Dues!</p>
    </div>`

    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to :`${proffEmail}`,
        subject : 'No-Dues request for BTP/Scholarly work/Thesis',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}