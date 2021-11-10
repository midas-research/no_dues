const nodemailer = require('../config/nodemailer');

exports.girlsHostelNodues_mailer = (email) => {
    console.log('inside new message mailer');
    //let htmlString = nodemailer.renderTemplate({data: message}, '/new_message');
    let htmlString = `
    <div>
        <p>Hello!</p>
        <br>
        <br>
        <p>Kindly look at the following excel sheet to validate the dues of these students.</p>
        <br>
        <p>https://docs.google.com/spreadsheets/d/1PR4IfK6_I8ye6jjIzFMaHQ8SE4f0CbhBBdPLRan4Ji0/edit?usp=sharing</p>
        <br>
        <p>Thanks no-dues!</p>
    </div>`
    console.log(htmlString);
    nodemailer.transporter.sendMail({
        from : 'no-dues@iiitd.ac.in',
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