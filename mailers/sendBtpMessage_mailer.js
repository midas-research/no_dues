const nodemailer = require('../config/nodemailer');
const {NODEMAILER_EMAIL_ID}=require('../config/config');

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

exports.sendBtpMessage_mailer = (message, email, admin) => {
    let htmlString = `
    <div>
        <p>Hi ${fetchStudentName(email)}!</p>
        <br>
        <p>You have received the following message regarding your dues in the BTP/Scholarly paper/Thesis under ${fetchProffName(admin)}.</p>
        <br>
        <p>Message - ${message}</p>
        <br>
        <p>Thanks No-Dues!</p>
    </div>`
    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to : email,
        subject : 'No-Dues message',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}