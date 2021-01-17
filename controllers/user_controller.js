module.exports.profile = (req, res) => {
    return res.render('profile', {
        title: 'Profile page'
    });
}