const nodemailer = require('../config/nodemailer');
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

exports.approvedDues = async (admin, email) => {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8000/user/getAdmins', false);
    request.send(null);
    if (request.status === 200) {
    adminsList = JSON.parse(request.responseText);
    }
    var adminDetails = {};
    for (var i in adminsList) {
        adminDetails[changeNameFormat(adminsList[i][0])] = {
            'name': adminsList[i][2]
        };
    }
    console.log('inside new message mailer');
    if (admin == 'academics') {
        await User.findOne({email: email}, (err, user) => {
            if (err) {console.log('Error in finding user in approveDues: ', err); return;}
            if (user['degree'] == 'B. Tech') {admin = 'academicsBtech'}
            if (user['degree'] == 'M. Tech') {admin = 'academicsMtech'}
            if (user['degree'] == 'PhD') {admin = 'academicsPhd'}
        });
    }
    //let htmlString = nodemailer.renderTemplate({data: message}, '/new_message');
    let htmlString = `
    <div>
        <p>Hi ${fetchName(email)}!</p>
        <br>
        <p>Congratulations! Your No-Dues has been approved for the ${admin[0].toUpperCase()+admin.substring(1,)} department.</p>
        <br>
        <p>Thanks!</p>
        <p>${adminDetails[admin]['name']}</p>
    </div>`
    console.log(htmlString);
    nodemailer.transporter.sendMail({
        from : 'no-dues@iiitd.ac.in',
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