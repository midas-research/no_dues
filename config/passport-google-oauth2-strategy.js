const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const professors = require('../professors');
const getAdminName = require('../data/getAdminName');
const isAdmin = require('../data/isAdmin');

passport.use(new googleStrategy({
    clientID: '417822814724-2klognhn6le7q43c0vc0tqpn0cbgu053.apps.googleusercontent.com',
    clientSecret: 'tn3wI5iFPkAawIotSB9IHIX2',
    callbackURL: 'https://bbee-103-25-231-107.ngrok.io/user/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    if (isAdmin.isAdmin(profile.emails[0].value)) {
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
                    department: getAdminName.getAdminName(profile.emails[0].value)
                }, (err, user) => {
                    if (err) {
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                })
            }
        })
    } else if (profile.emails[0].value in professors) {
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
                    academics: false,
                    designLabApplied: false,
                    libraryApplied: false,
                    adminFacilitiesApplied: false,
                    systemAdminApplied: false,
                    sportsApplied: false,
                    hostelApplied: false,
                    eceLabsApplied: false,
                    placementApplied: false,
                    incubationApplied: false,
                    financeApplied: false,
                    academicsApplied: false
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