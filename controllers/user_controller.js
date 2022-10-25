const User = require('../models/user');
const professors = require('../professors');
const isAdmin = require('../data/isAdmin');
const getAdminName = require('../data/getAdminName');
const professorsList = require('../data/professors.json');
const studentsList = require('../data/students.json');
const adminsList = require('../data/admins.json');
const {CURRENT_URL}=require('../config/config');


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
            if (isAdmin.isAdmin(req.body.email)) {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    type: 'Admin',
                    department: getAdminName.getAdminName(req.body.email)
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
    req.flash('success', 'Logged in successfully');
    if (isAdmin.isAdmin(req.user.email)) {
        return res.redirect('/admin_home');
    }
    if (req.user.email == 'no-dues.iiitd.ac.in') {
        return res.redirect('/super_admin');
    }
    if (req.user.email in professors) {
        return res.redirect('/proff_home');
    }
    return res.redirect('/');
}

module.exports.destroySession = (req, res) => {
    req.flash('success', 'Logged out successfully');
    req.logout();
    return res.redirect('/user/signin');
}

module.exports.getProfessors = (req, res) => {
    return res.status(200).json(professorsList);
}

module.exports.getUser = async (req, res) => {
    var id = req.params.id;
    await User.findById(id, (err, user) => {
        if (err) {console.log('Error in finding user in getuser ', err); return;}
        return res.status(200).json(user);
    });
}

module.exports.getStudents = (req, res) => {
    return res.status(200).json(studentsList);
}

module.exports.getAdmins = (req, res) => {
    return res.status(200).json(adminsList);
}

module.exports.getStudentsLoggedIn = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {console.log('Error in finding all users in getStudentsLoggedIn: ', err); return;}
        return res.status(200).json(users);
    });
}