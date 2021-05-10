const User = require('../models/user');
const professors = require('../professors');

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
        return res.redirect('/');
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
            if (isAdmin(req.body.email)) {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    type: 'Admin',
                    department: getAdminName(req.body.email)
                }, (err, user) => {
                    if (err) {
                        console.log('Error in creating user in sign up');
                        return;
                    }
                    return res.redirect('/user/signin');
                });
            } else {
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
            }
        } else {
            return res.redirect('back');
        }
    })
}

module.exports.createSession = (req, res) => {
    if (isAdmin(req.user.email)) {
        return res.redirect('/admin_home');
    }
    if (req.user.email == 'cyborg@sc.iiitd.ac.in') {
        return res.redirect('/super_admin');
    }
    if (req.user.email in professors) {
        return res.redirect('/proff_home');
    }
    return res.redirect('/');
}

module.exports.destroySession = (req, res) => {
    req.logout();
    return res.redirect('/user/signin');
}