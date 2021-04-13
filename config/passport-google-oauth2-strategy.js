const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

function getAdminName(email) {
    if (email == 'no-dues@iiitd.ac.in') {
        return 'designLab';
    } else if (email == 'rajendra@iiitd.ac.in') {
        return 'library';
    } else if (email == 'admin-facilities@iiitd.ac.in') {
        return 'adminFacilities';
    } else if (email == 'abhinay@iiitd.ac.in') {
        return 'systemAdmin';
    } else if (email == 'ravi@iiitd.ac.in') {
        return 'sports';
    } else if (email == 'rahul@iiitd.ac.in') {
        return 'eceLabs';
    } else if (email == 'rashmil@iiitd.ac.in') {
        return 'placement';
    } else if (email == 'geetagupta@iiitdic.in') {
        return 'incubation';
    } else if (email == 'varsha@iiitd.ac.in') {
        return 'finance';
    } else if (email == 'admin-btech@iiitd.ac.in') {
        return 'academics';
    } else {
        return 'student';
    }
}

function isAdmin(email) {
    const arr = [
        'no-dues@iiitd.ac.in',
        'rajendra@iiitd.ac.in',
        'admin-facilities@iiitd.ac.in',
        'abhinay@iiitd.ac.in',
        'ravi@iiitd.ac.in',
        'rahul@iiitd.ac.in',
        'rashmil@iiitd.ac.in',
        'geetagupta@iiitdic.in',
        'varsha@iiitd.ac.in',
        'admin-btech@iiitd.ac.in',
        'admin-mtech@iiitd.ac.in',
        'admin-phd@iiitd.ac.in',
    ];
    if (arr.includes(email)) {
        return true;
    } else {
        return false;
    }
}

passport.use(new googleStrategy({
    clientID: '417822814724-2klognhn6le7q43c0vc0tqpn0cbgu053.apps.googleusercontent.com',
    clientSecret: 'tn3wI5iFPkAawIotSB9IHIX2',
    callbackURL: 'http://localhost:8000/user/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    if (isAdmin(profile.emails[0].value)) {
        User.findOne({email: profile.emails[0].value}).exec((err, user) => {
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
                    type: 'Admin',
                    department: getAdminName(profile.emails[0].value)
                }, (err, user) => {
                    if (err) {
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                })
            }
        })
    } else {
        User.findOne({email: profile.emails[0].value}).exec((err, user) => {
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
                    designLab: false,
                    library: false,
                    adminFacilities: false,
                    systemAdmin: false,
                    sports: false,
                    hostel: false,
                    eceLabs: false,
                    placement: false,
                    incubation: false,
                    finance: false,
                    academics: false
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