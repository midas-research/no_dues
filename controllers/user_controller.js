const User = require('../models/user');

module.exports.profile = (req, res) => {
    return res.render('profile', {
        title: 'Profile page'
    });
}

module.exports.signup = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }
    return res.render('signup', {
        title: 'Sign Up'
    });
}

module.exports.signin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }
    return res.render('signin', {
        title: 'Sign In'
    });
}

module.exports.create = (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            console.log('Error in finding user in sign up');
            return;
        }
        if (!user) {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }, (err, user) => {
                if (err) {
                    console.log('Error in creating user in sign up');
                    return;
                }
                return res.redirect('/user/signin');
            });
        } else {
            return res.redirect('back');
        }
    })
}

module.exports.createSession = (req, res) => {
    return res.redirect('/');
}

module.exports.destroySession = (req, res) => {
    req.logout();
    return res.redirect('/');
}