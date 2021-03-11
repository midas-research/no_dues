module.exports.home = (req, res) => {
    return res.render('home', {
        title: 'Home Page'
    });
}

module.exports.adminHome = (req, res) => {
    return res.render('admin_home', {
        'title': 'Admin - Home'
    })
}

module.exports.studentList = (req, res) => {
    return res.render('student_list', {
        'title' : 'No-Dues List'
    });
}