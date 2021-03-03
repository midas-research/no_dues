const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: '417822814724-2klognhn6le7q43c0vc0tqpn0cbgu053.apps.googleusercontent.com',
    clientSecret: 'tn3wI5iFPkAawIotSB9IHIX2',
    callbackURL: 'http://localhost:8000/user/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({email: profile.emails[0].value}).exec((err, user) => {
        if (err) {
            console.log('Error in google strategy passport', err);
            return;
        }
        if (user) {
            return done(null, user);
        } else {
            User.create({
                name: profile.name["givenName"],
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex'),
                image: profile.photos[0].value
            }, (err, user) => {
                if (err) {
                    console.log('Error in creating user google strategy-passport', err);
                    return;
                }
                return done(null, user);
            })
        }
    })
}))