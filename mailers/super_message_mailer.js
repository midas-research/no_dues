const nodemailer = require('../config/nodemailer');
const {CURRENT_URL,NODEMAILER_EMAIL_ID}= require('../config/config');

function fetchName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index-5);
    return name[0].toUpperCase() + name.substring(1,);
}

exports.newMessage = async (message, email) => {
      
    let htmlString = `
    <div>
        <p>Hi ${fetchName(email)}!</p>
        <br>
        <p>You have received the following message regarding your dues.</p>
        <br>
        <p> No Dues Clearance Rejected!</p>
        <p> Message: ${message}</p>
        <br>
        <p>Thanks!</p>
        <p>No-Dues</p>
    </div>`;

    
    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to : email,
        subject : 'Message from No-Dues!',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
    
}