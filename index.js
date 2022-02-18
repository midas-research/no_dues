const express = require('express');
const port = 8000;
const axios = require('axios');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const mongoStore = require('connect-mongo')(session);
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const { google } = require('googleapis');
//const request = require('request-promise');
const cheerio = require('cheerio');
const https = require('https');
//const professorsList = require('./config/professors');
const fs = require('fs');
// g6d=Z8P%
// ssh iiitd@192.168.1.240
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./assets'));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({
    name: 'nodues',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100
    },
    store: new mongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, (err) => {
        if (err) {
            console.log('Error in setting up connect-mongo');
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', require('./routes/index'));

app.listen(port, async (err) => {
    if (err) {
        console.log('Error in running the server', err);
        return;
    }
    console.log('Server is running perfectly fine on port: ', port);

    var spreadsheetId = "1fdqYc6YxhabH18J07hA0c5f4S_VA_aYfguvLltn17Aw";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({ version: "v4", auth: client });
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    });
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    global.admins_data = data.data.values;
    fs.readFile('./data/admins.json', (err, data) => {
        if (err) { console.log('Error in writing to admins file: ', err); return; }
        if (data != JSON.stringify(global.admins_data)) {
            fs.writeFile('./data/admins.json', JSON.stringify(global.admins_data), (err) => {
                if (err) { console.log('Error in writing to admins file: ', err); return; }
            });
        }
    });

    var spreadsheetId = "1Z1iuQizDRU_P_tfED0ICzx1k-u-ZaLkO_cWSWOZjul8";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({ version: "v4", auth: client });
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    });
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    professors_data = data.data.values;
    fs.readFile('./data/professors.json', (err, data) => {
        if (err) { console.log('Error in writing to admins file: ', err); return; }
        if (data != JSON.stringify(professors_data)) {
            fs.writeFile('./data/professors.json', JSON.stringify(professors_data), (err) => {
                if (err) { console.log('Error in writing to admins file: ', err); return; }
            });
        }
    });
    var proffNames = {};
    for (var i in professors_data) {
        proffNames[professors_data[i][1]] = professors_data[i][0];
    }
    var text = `module.exports.getProffName = (email) => {
        return adminNames[email];
    }
    module.exports.proffNames = proffNames;`
    fs.writeFile('./data/getProffName.js', 'var proffNames = ' + JSON.stringify(proffNames) + '\n' + text, (err) => {
        if (err) { console.log('Error in writing to admins file: ', err); return; }
    });

    var spreadsheetId = "1cBBIKCdmScEndsOtuSK4OZl4MyNhZxsPNAewyq6MikU";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({ version: "v4", auth: client });
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    });
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "ALL"
    });
    students_data = data.data.values;
    fs.readFile('./data/students.json', (err, data) => {
        if (err) { console.log('Error in writing to admins file: ', err); return; }
        if (data != JSON.stringify(students_data)) {
            fs.writeFile('./data/students.json', JSON.stringify(students_data), (err) => {
                if (err) { console.log('Error in writing to admins file: ', err); return; }
            });
        }
    });

    function changeNameFormat(name) {
        if (name.substring(0, 9) == 'Academics') {
            return 'academics';
        }
        var arr = name.split(" ");
        var newName = arr[0].toLowerCase();
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] == '&') {
                arr[i] = 'and';
            }
            newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1,);
        }
        return newName;
    }

    var adminNames = {};
    var names = [];
    for (var i in global.admins_data) {
        adminNames[global.admins_data[i][1]] = changeNameFormat(global.admins_data[i][0]);
        names.push(changeNameFormat(global.admins_data[i][0]));
    }
    var text = `module.exports.getAdminName = (email) => {
        if (email in adminNames) {
            return adminNames[email];
        } else {
            return 'student';
        }
    }
    module.exports.adminNames = adminNames;`
    global.admins_data = adminNames;
    fs.writeFile('./data/getAdminName.js', 'var adminNames = ' + JSON.stringify(adminNames) + '\n' + text, (err) => {
        if (err) { console.log('Error in writing to admins file: ', err); return; }
    });


    //creating the user model
    // var s = JSON.stringify({type: String});
    // var b = JSON.stringify({type: Boolean});
    // var sr = JSON.stringify({ type: String, required: true });
    // var sru = JSON.stringify({ type: String, required: true, unique: true });
    // var schemaObject = {
    //     name: { type: String, required: true },
    //     email: { type: String, required: true, unique: true },
    //     password: { type: String, required: true },
    //     image: { type: String, required: true, unique: true },
    //     degree: { type: String },
    //     startYear: { type: String },
    //     type: { type: String },
    //     branch: { type: String },
    //     roll: { type: String },
    //     gender: {type: String },

    //     ip: { type: String },
    //     btp: { type: String },
    //     ipApproved: {type: Boolean},
    //     btpApproved: {type: Boolean},
    //     ipApplied: { type: String },
    //     btpApplied: { type: String },
    //     ipAppliedAt: { type: String },
    //     btpAppliedAt: { type: String },
    //     ipApprovedAt: { type: String },
    //     btpApprovedAt: { type: String },
    //     ipMessage: { type: String },
    //     btpMessage: { type: String },
    //     bankName: {type: String},
    //     bankBranch: {type: String},
    //     bankAccountNo: {type: String},
    //     bankIfscCode: {type: String},
    //     mobile: {type: String},
    //     other_email: {type: String},
    //     date_of_leaving: {type: String},
    //     reason_of_leaving: {type: String},
    // }
    // for (var i=0; i<names.length-2; i++) {
    //     schemaObject[names[i]] = { type: Boolean }
    //     schemaObject[names[i]+'Applied'] = { type: Boolean }
    //     schemaObject[names[i]+'AppliedAt'] = { type: String }
    //     schemaObject[names[i]+'ApprovedAt'] = { type: String }
    //     schemaObject[names[i]+'Message'] = { type: String }
    // }
    // console.log("===>>>", schemaObject);
    // var modelText = `const mongoose = require('mongoose');
    // mongoose.set('useFindAndModify', false); \n`
    // modelText = modelText + `for (const [key, value] of Object.entries(schemaObject)) { \n
    //     schemaObject[key]['type'] = String \n
    // } \n`;
    // modelText = modelText + 'const userSchema = new mongoose.Schema('+JSON.stringify(schemaObject)+`, {
    //     timestamps: true
    // }); \n`
    // modelText = modelText + '\n' + `const User = mongoose.model('User', userSchema); \n
    // module.exports = User;`

    // fs.readFile('./models/user.js', (err, data) => {
    //     if (err) {console.log('Error in writing to admins file: ', err); return;}
    //     if (data != modelText) {
    //         fs.writeFile('./models/user.js', modelText, (err) => {
    //             if (err) {console.log('Error in writing to admins file: ', err); return;}
    //         });
    //     }
    // });
});

//client id = 417822814724-2klognhn6le7q43c0vc0tqpn0cbgu053.apps.googleusercontent.com
//client secret = tn3wI5iFPkAawIotSB9IHIX2