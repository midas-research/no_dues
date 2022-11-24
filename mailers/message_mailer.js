const nodemailer = require('../config/nodemailer');
const axios=require('axios')
const {CURRENT_URL,NODEMAILER_EMAIL_ID}= require('../config/config');
const User = require('../models/user');


function changeNameFormat(name) {
    if (name.substring(0,9) == 'Academics') {
        return 'academics';
    }
    var arr = name.split(" ");
    var newName = arr[0].toLowerCase();
    for (var i=1; i<arr.length; i++) {
        if (arr[i] == '&') {
            arr[i] = 'and';
        }
        newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1,);
    }
    return newName;
}

function fetchName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index-5);
    return name[0].toUpperCase() + name.substring(1,);
}

exports.newMessage = async (message, email, admin) => {
    await axios.get(`${CURRENT_URL}/user/getAdmins`).then(function(response) {
        return response.data;
    }).then(async function(data) {
        var adminDetails = {};
        var adminsList = data;
        for (var i in adminsList) {
            adminDetails[changeNameFormat(adminsList[i][0])] = {
                'name': adminsList[i][2]
            };
        }
        if (admin == 'academics') {
            await User.findOne({email: email}, (err, user) => {
                if (err) {console.log('Error in finding user in approveDues: ', err); return;}
                if (user['degree'] == 'B. Tech') {admin = 'academicsBtech'}
                if (user['degree'] == 'M. Tech') {admin = 'academicsMtech'}
                if (user['degree'] == 'PhD') {admin = 'academicsPhd'}
                adminDetails[admin] = {
                    'name': adminDetails['academics']['name']
                };
            });
        }
        
        let htmlString = `
        <div>
            <p>Hi ${fetchName(email)}!</p>
            <br>
            <p>You have received the following message regarding your dues in the ${admin[0].toUpperCase()+admin.substring(1,)} department.</p>
            <br>
            <p> No Dues Rejected!</p>
            <p>Message - ${message}</p>
            <br>
            <p>Thanks!</p>
            <p>${adminDetails[admin]['name']}</p>
        </div>`;

        
        nodemailer.transporter.sendMail({
            from : `${NODEMAILER_EMAIL_ID}`,
            to : email,
            subject : `Message from No-Dues's Department!`,
            html : htmlString
        }, (err, info) => {
            if (err) {
                console.log('Error in sending mail', err);
                return;
            }
            return;
        })
    })
}