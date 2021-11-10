const passport = require('passport');
const {google} = require('googleapis');
const LocalStrategy = require('passport-local').Strategy;
const isAdmin = require('../data/isAdmin');

const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User.findOne({email: email}, (err, user) => {
        if (err) {
            console.log('Error in finding user in passport');
            return done(err);
        }
        if (!user || user.password!=password) {
            console.log('Invalid username/password');
            return done(null, false);
        }
        return done(null, user);
    })
    }
));

//serialize the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            console.log('Error in finding user in passport');
            return done(err);
        }
        return done(null, user);
    })
});

//check if the user is authenticated
passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/user/signin');
}

passport.checkSuperAdminAuthentication = async (req, res, next) => {
    if (req.isAuthenticated() && req.user.email=='no-dues@iiitd.ac.in') {
        return next();
    }
    return res.redirect('/user/signin');
}

passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

passport.checkSheetAuthentication = async (req, res, next) => {
    const spreadsheetId = "1yapIMuyvzPVX5Sy3n5p5kLJH5aqWdnLBoLbaw4AsVi8";
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    })
    //console.log(metadata.data);
    await googleSheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    values = [];
    values.push(['Name', 'Roll no.', 'Email', 'Design Lab', 'Library', 'Admin Facilities', 
        'System Admin', 'Sports', 'Hostel', 'ECE Labs', 'Placement', 'Incubation', 'Finance',
        'Academics', 'IP1', 'IP2', 'BTP']);
    var docs = await User.find({});
    for (var i in docs) {
        if (!docs[i]['type']) {
            var temp = [];
            temp.push(docs[i]['name']);
            temp.push('2018104');
            temp.push(docs[i]['email']);
            temp.push(docs[i]['designLab']);
            temp.push(docs[i]['library']);
            temp.push(docs[i]['adminFacilities']);
            temp.push(docs[i]['systemAdmin']);
            temp.push(docs[i]['sports']);
            temp.push(docs[i]['hostel']);
            temp.push(docs[i]['eceLabs']);
            temp.push(docs[i]['placement']);
            temp.push(docs[i]['incubation']);
            temp.push(docs[i]['finance']);
            temp.push(docs[i]['academics']);
            temp.push('false');
            temp.push('false');
            temp.push(docs[i]['btpApproved']);
            values.push(temp);
        }
    }
    await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values
        }
    })
    next();
}

passport.checkBankAuthentication = async (req, res, next) => {
    const spreadsheetId = "1jKQsMLiwSW5KwcKP1uxL-cnpMFWG_gv9FP2fz3Ha3t4";
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    })
    //console.log(metadata.data);
    await googleSheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    values = [];
    values.push(['Name', 'Roll no.', 'Email', 'Bank Name', 'Branch Name', 
        'Account No', 'IFSC Code']);
    var docs = await User.find({});
    for (var i in docs) {
        if (!docs[i]['type']) {
            var temp = [];
            temp.push(docs[i]['name']);
            temp.push('2018104');
            temp.push(docs[i]['email']);
            temp.push(docs[i]['bankName']);
            temp.push(docs[i]['bankBranch']);
            temp.push(docs[i]['bankAccountNo']);
            temp.push(docs[i]['bankIfscCode']);
            values.push(temp);
        }
    }
    await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values
        }
    });
    next();
}

module.exports = passport;