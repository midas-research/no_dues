const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const getProffName = require('../data/getProffName');
const getAdminName = require('../data/getAdminName');
const isAdmin = require('../data/isAdmin');
const fs = require('fs');
const { google } = require('googleapis');
const students_data = require('../data/students.json');
const {CURRENT_URL, GOOGLE_SIGNIN_CLIENT_ID,GOOGLE_SIGNIN_SECRET_ID}= require('../config/config');

// console.log({CURRENT_URL});

function getGender(email, students) {
    for (var i in students) {
        if (students[i][5] == email) {
            var gender = students[i][4];
            var branch = students[i][3];
            var degree = students[i][0]
            var roll = students[i][1];
            var name = students[i][2];
            if (gender == 'm' || gender == 'M' || gender == 'male' || gender == 'Male') {
                gender = 'male';
            } else if (gender == 'f' || gender == 'F' || gender == 'female' || gender == 'Female') {
                gender = 'female';
            } else {
                gender = 'others';
            }
            if (branch == 'Computer Science and Applied Mathematics' || branch == 'Computer Science & Applied Mathematics' || branch == 'CSAM') {
                branch = 'CSAM';
            }
            if (branch == 'Computer Science and Engineering' || branch == 'Computer Science & Engineering' || branch == 'CSE') {
                branch = 'CSE';
            }
            if (branch == 'Computer Science and Design' || branch == 'Computer Science & Design' || branch == 'CSD') {
                branch = 'CSD';
            }
            if (branch == 'Electronics and Communication Engineering' || branch == 'Electronics & Communication Engineering' || branch == 'ECE') {
                branch = 'ECE';
            }
            if (branch == 'Computer Science and Biosciences' || branch == 'Computer Science and Biosciences' || branch == 'CSB') {
                branch = 'CSB';
            }
            if (branch == 'Computer Science and Artificial Intelligence' || branch == 'Computer Science and Artificial Intelligence' || branch == 'CSAI') {
                branch = 'CSAI';
            }
            if (branch == 'Computer Science and Social Sciences' || branch == 'Computer Science and Social Sciences' || branch == 'CSSS') {
                branch = 'CSSS';
            }
            if (degree == 'B.Tech' || degree == 'B.Tech.') {
                degree = 'B. Tech';
            }
            if (degree == 'M.Tech' || degree == 'M.Tech.') {
                degree = 'M. Tech';
            }
            if (degree == 'PhD') {
                degree = 'PhD';
            }
            return [gender, branch, degree, roll, name];
        }
    }
    return null;
};


passport.use(new googleStrategy({
    clientID: `${GOOGLE_SIGNIN_CLIENT_ID}`,
    clientSecret: `${GOOGLE_SIGNIN_SECRET_ID}`,
    callbackURL: `${CURRENT_URL}/user/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    // console.log("entered");
    if (isAdmin.isAdmin(profile.emails[0].value)) {
        // console.log("Admin found");
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
            if (err) {
                console.log('Error in google strategy passport', err); return;
            }
            if (user) {
                return done(null, user);
            } else {
                User.create({
                    name: getAdminName.getAdminName(profile.emails[0].value),
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    image: profile.photos[0].value,
                    type: 'Admin',
                    department: getAdminName.getAdminName(profile.emails[0].value)
                }, (err, user) => {
                    if (err) {
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                });
            }
        })
    } else if (getProffName.isProff(profile.emails[0].value)) {
        // console.log("prog hee hai");
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
            if (err) {
                console.log('Error in google strategy passport', err); return;
            }
            if (user) {
                return done(null, user);
            } else {
                User.create({
                    name: profile.name["givenName"],
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    image: profile.photos[0].value,
                    type: 'Proff',
                }, (err, user) => {
                    if (err) {
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                })
            }
        })
    } else {
        // var spreadsheetId = "1NfsIc8CO7n4CvqkmtmGhoOQgL7lGKAmlbk3konSuCxY";
        // var auth = new google.auth.GoogleAuth({
        //     keyFile: "credentials.json",
        //     scopes: "https://www.googleapis.com/auth/spreadsheets"
        // });
        // var client = await auth.getClient();
        // var googleSheets = google.sheets({ version: "v4", auth: client });
        // var metadata = await googleSheets.spreadsheets.get({
        //     auth: auth,
        //     spreadsheetId: spreadsheetId
        // });
        // var data = await googleSheets.spreadsheets.values.get({
        //     auth: auth,
        //     spreadsheetId: spreadsheetId,
        //     range: "ALL"
        // });
        // students_data = data.data.values;
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
            if (err) {
                console.log('Error in google strategy passport', err); return;
            }
            if (user) {
                return done(null, user);
            } else {
                var details = getGender(profile.emails[0].value, students_data);
                if(!details){
                    return done(null,false);
                }
                User.create({
                    name: details[4],
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    image: profile.photos[0].value,
                    designLab: false,
                    library: false,
                    adminFacilities: false,
                    systemAdminAndNetworking: false,
                    sportsAndStudentFacilities: false,
                    hostel: false,
                    eceLabs: false,
                    placementIncharge: false,
                    incubationCenter: false,
                    finance: false,
                    academics: false,
                    designLabApplied: false,
                    libraryApplied: false,
                    adminFacilitiesApplied: false,
                    systemAdminAndNetworkingApplied: false,
                    sportsAndStudentFacilitiesApplied: false,
                    hostelApplied: false,
                    eceLabsApplied: false,
                    placementInchargeApplied: false,
                    incubationCenterApplied: false,
                    financeApplied: false,
                    academicsApplied: false,
                    gender: details[0],
                    branch: details[1],
                    degree: details[2],
                    roll: details[3]
                }, (err, user) => {
                    if (err) {
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                })
            }
        })
    }
}))

