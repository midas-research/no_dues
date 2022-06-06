const nodemailer = require('../config/nodemailer');

exports.boysHostelNodues_mailer = (email) => {
    let htmlString = `
    <div>
        <p>Hello!</p>
        <br>
        <br>
        <p>Kindly look at the following excel sheet to validate the dues of these students.</p>
        <br>
        <p>https://docs.google.com/spreadsheets/d/1i4S4fbsVjBmpod-qplGgIH0BAhW_DsSj2B_2k0aHvaQ/edit?usp=sharing</p>
        <br>
        <p>Thanks no-dues!</p>
    </div>`
    nodemailer.transporter.sendMail({
        from : 'no-dues@iiitd.ac.in',
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