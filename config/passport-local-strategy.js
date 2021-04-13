const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

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

passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;