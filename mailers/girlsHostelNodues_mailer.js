const nodemailer = require('../config/nodemailer');
const {NODEMAILER_EMAIL_ID}=require('../config/config');

exports.girlsHostelNodues_mailer = (email) => {
    let htmlString = `
    <div>
        <p>Hello!</p>
        <br>
        <br>
        <p>Kindly look at the following excel sheet to validate the dues of these students.</p>
        <br>
        <p>https://docs.google.com/spreadsheets/d/1DpGS0s-_E1G0JqWBEebMa5CXwoGj2L_9mLi6daoQzpc/edit?usp=sharing</p>
        <br>
        <p>Thanks no-dues!</p>
    </div>`
    nodemailer.transporter.sendMail({
        from : `${NODEMAILER_EMAIL_ID}`,
        to : email,
        subject : 'No-Dues for girls hostel',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}