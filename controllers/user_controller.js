module.exports.profile = (req, res) => {
    return res.render('profile', {
        title: 'Profile page'
    });
}

module.exports.signup = (req, res) => {
    return res.render('signup', {
        title: 'Sign Up'
    });
}

module.exports.signin = (req, res) => {
    return res.render('signin', {
        title: 'Sign In'
    });
}

module.exports.create = (req, res) => {
    
}

module.exports.createSession = (req, res) => {
    
}