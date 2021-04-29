const nodemailer = require('../config/nodemailer');

var adminDetails = {
    'designLab' : {
        'name' : 'Abhijeet Mishra',
        'address' : '[B-003 (R&D Block)]'
    },
    'library' : {
        'name' : 'Rajendra Singh',
        'address' : 'Library office'
    },
    'adminFacilities' : {
        'name' : 'Sanjay Ray',
        'address' : 'BMS 2nd floor'
    },
    'systemAdmin' : {
        'name' : 'Abhinav Saxena',
        'address' : 'B-105 (Old Acad)'
    },
    'sports' : {
        'name' : 'Ravi Bhasin',
        'address' : 'A-207-1 (Old Acad)'
    },
    'hostel' : {
        'name' : 'Ravi Bhasin',
        'address' : 'A-207-1 (Old Acad)'
    },
    'eceLabs' : {
        'name' : 'Rahul Gupta',
        'address' : 'B-304/5/2 (LHC)'
    },
    'placement' : {
        'name' : 'Rashmil Mishra',
        'address' : 'B-311 (LHC)'
    },
    'incubation' : {
        'name' : 'Geeta Gupta',
        'address' : 'Student center'
    },
    'finance' : {
        'name' : 'Varsha Aggarwal',
        'address' : ''
    },
    'academicsBtech' : {
        'name' : 'Nisha Aggarwal',
        'address' : ''
    },
    'academicsMtech' : {
        'name' : 'Ashutosh Brahma',
        'address' : ''
    },
    'academicsPhd' : {
        'name' : 'Priti Patwal',
        'address' : ''
    }
}

function fetchName(email) {
    var index = email.indexOf('@');
    var name = email.substring(0, index-5);
    return name[0].toUpperCase() + name.substring(1,);
}

exports.newMessage = (message, email, admin) => {
    console.log('inside new message mailer');
    //let htmlString = nodemailer.renderTemplate({data: message}, '/new_message');
    let htmlString = `
    <div>
        <p>Hi ${fetchName(email)}!</p>
        <br>
        <p>You have received the following message regarding your dues in the ${admin[0].toUpperCase()+admin.substring(1,)} department.</p>
        <br>
        <p>Message - ${message}</p>
        <br>
        <p>Thanks ${adminDetails[admin]['name']}!</p>
        <p>${adminDetails[admin]['address']}</p>
    </div>`
    console.log(htmlString);
    nodemailer.transporter.sendMail({
        from : 'no-dues@iiitd.ac.in',
        to : email,
        subject : 'No-Dues message',
        html : htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}