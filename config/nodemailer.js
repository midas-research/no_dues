const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const {NODEMAILER_EMAIL_ID,NODEMAILER_PASS}=require('../config/config');


let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smtp.gmail.com',
    port : 587,
    secure : false,
    auth : {
        user : `${NODEMAILER_EMAIL_ID}`,
        pass : `${NODEMAILER_PASS}`
        
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log('Error in rendering email template: ', err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}
