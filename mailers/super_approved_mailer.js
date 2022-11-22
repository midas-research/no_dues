const nodemailer = require('../config/nodemailer');
const {CURRENT_URL,NODEMAILER_EMAIL_ID}= require('../config/config');

function fetchName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index-5);
    return name[0].toUpperCase() + name.substring(1,);
}

exports.approvedDues = async (email) => {         
        
    let htmlString = `
        <div>
            <p>Hi ${fetchName(email)}!</p>
            <br>
            <p>Congratulations! You have got No-Dues Clearance!.</p>
            <br>
            <p>Thanks!</p>
            <p>No-Dues</p>
        </div>`;

    let sub=`No-Dues Clearance`;  
    

    
    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to : email,
        subject : sub,
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
    
}