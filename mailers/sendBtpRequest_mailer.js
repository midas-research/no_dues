const nodemailer = require('../config/nodemailer');

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

exports.sendBtpRequest = (proffEmail, studentEmail) => {
    console.log('inside new message mailer');
    let htmlString = `
    <div>
        <p>Hi ${fetchProffName(proffEmail)}!</p>
        <br>
        <p>You have received the following message requesting dues clearance for 
        BTP/Schlar Paper/Thesis from ${fetchStudentName(studentEmail)} 
        (email - ${studentEmail}).</p>
        <br>
        <p>Thanks no-dues!</p>
    </div>`
    console.log(htmlString);
    nodemailer.transporter.sendMail({
        from : 'no-dues@iiitd.ac.in',
        to : proffEmail,
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