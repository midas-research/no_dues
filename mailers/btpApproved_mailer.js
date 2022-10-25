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

exports.btpApproved_mailer = (admin, email) => {
    let htmlString = `
    <div>
        <p>Hi ${fetchStudentName(email)}!</p>
        <br>
        <p>Congratulations! Your No-Dues has been approved for the BTP/Scholarly Paper/Thesis work under ${fetchProffName(admin)}.</p>
        <br>
        <p>Thanks no-dues!</p>
    </div>`
    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to : email,
        subject : 'No-Dues approved',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}