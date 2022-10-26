const passport = require('passport');
const {google} = require('googleapis');
const LocalStrategy = require('passport-local').Strategy;
const isAdmin = require('../data/isAdmin');
const getProff=require('../data/getProffName');

const User = require('../models/user');
const {EMAIL_ID}=require('../config/config');

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

//check if the incoming user is authenticated
passport.checkAuthentication = (req, res, next) => {
    // console.log("Mein idhar ja rha bye!");
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/user/signin');
}

//check if it's admin
passport.checkAdminAuthentication = (req, res, next) => {
    // console.log("Bhai hun idhar!");
    if (req.isAuthenticated()){
        if(isAdmin.isAdmin(req.user.email)) {
            // console.log("Bhai hun mein admin");
            return next();
        }
        else if(getProff.isProff(req.user.email)){
            // return res.redirect('/proff_home');
        }
        else{
            // console.log("Bhai user");
            return res.redirect('/');
        }
    }

    return res.redirect('/user/signin');
    
    
}


//check if it's a normal User
passport.checkUserAuthentication = (req, res, next) => {
    if (req.isAuthenticated()){
        if(isAdmin.isAdmin(req.user.email)) {
            return res.redirect('/admin_home');
        }
        else if(getProff.isProff(req.user.email)){
            return res.redirect('/proff_home');
        }
        else{
            return next();
        }
    }
    
    return res.redirect('/user/signin');
}


//check if it's Proffesor
passport.checkProffAuthentication = (req, res, next) => {
    if (req.isAuthenticated()){
        if(isAdmin.isAdmin(req.user.email)) {
            return res.redirect('/admin_home');
        }
        else if(getProff.isProff(req.user.email)){
            return next();
        }
        else{
            return res.redirect('/');
        }
    }
    return res.redirect('/user/signin');
}




//check if superAdmin
passport.checkSuperAdminAuthentication = async (req, res, next) => {
    if (req.isAuthenticated() && req.user.email==`${EMAIL_ID}`) {
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
    //No Dues Details
    const spreadsheetId = "1zRLMi10k1zxMyv2uygSUhcxSEJsova76t8fBXi3GiSk";
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
    console.log(metadata.data);
    await googleSheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    values = [];
    values.push(['Name', 'Roll no.', 'Email', 'Design Lab', 'Library', 'Admin Facilities', 
        'System Admin', 'Sports', 'Hostel', 'ECE Labs', 'Placement', 'Incubation', 'Finance',
        'Academics', 'IP', 'BTP']);
    var docs = await User.find({});
    for (var i in docs) {
        if (!docs[i]['type']) {
            var temp = [];
            temp.push(docs[i]['name']);
            temp.push(docs[i]['roll']);
            temp.push(docs[i]['email']);
            temp.push(docs[i]['designLab']);
            temp.push(docs[i]['library']);
            temp.push(docs[i]['adminFacilities']);
            temp.push(docs[i]['systemAdminAndNetworking']);
            temp.push(docs[i]['sportsAndStudentFacilities']);
            temp.push(docs[i]['hostel']);
            temp.push(docs[i]['eceLabs']);
            temp.push(docs[i]['placementIncharge']);
            temp.push(docs[i]['incubationCenter']);
            temp.push(docs[i]['finance']);
            temp.push(docs[i]['academics']);
            if (docs[i]['ipApproved']) {
                temp.push(docs[i]['ipApproved']);
            } else {
                temp.push('false');
            }
            if (docs[i]['btpApproved']) {
                temp.push(docs[i]['btpApproved']);
            } else {
                temp.push('false');
            }
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
    //Account Details
    const spreadsheetId = "1Fn5EplhqwEB5c0chYqhhWCal5Kzs7hT4zNFCwkAkZpE";
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
            temp.push(docs[i]['roll']);
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