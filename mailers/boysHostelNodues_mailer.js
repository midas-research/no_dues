const nodemailer = require('../config/nodemailer');
const {NODEMAILER_EMAIL_ID}=require('../config/config');

exports.boysHostelNodues_mailer = (email) => {
    let htmlString = `
    <div>
        <p>Hello!</p>
        <br>
        <br>
        <p>Kindly look at the following excel sheet to validate the dues of these students.</p>
        <br>
        <p>https://docs.google.com/spreadsheets/d/1Tk6j9MmqSBOclnMr5XIQ1qGBa_pFXvjfKPmB9QCAG4o/edit?usp=sharing</p>
        <br>
        <p>Thanks no-dues!</p>
    </div>`
    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to : email,
        subject : 'No-Dues for boys hostel',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}