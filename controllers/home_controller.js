module.exports.home = (req, res) => {
    return res.render('home', {
        title: 'Home Page'
    });
}

module.exports.adminHome = (req, res) => {
    var studentList = [{
        'name' : 'Soumyadeep Paul',
        'email' : 'soumyadeep18104@iiitd.ac.in',
        'roll' : '2018104'
      }, {
        'name' : 'Yashdeep Prasad',
        'email' : 'yashdeep18121@iiitd.ac.in',
        'roll' : '2018121'
      }, {
        'name' : 'Himanshu Aggarwal',
        'email' : 'himanshu18146@iiitd.ac.in',
        'roll' : '2018146'
      }, {
        'name' : 'Vishwesh',
        'email' : 'vishwesh18084@iiitd.ac.in',
        'roll' : '2018084'
      }];
    return res.render('admin_home', {
        'title': 'Admin - Home',
        'studentList': studentList
    })
}

module.exports.studentList = (req, res) => {
    return res.render('student_list', {
        'title' : 'No-Dues List'
    });
}