const User = require('../models/user');

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

module.exports.home = (req, res) => {
  //console.log(req.user);
  var obj = [];
  obj.push(req.user);
    return res.render('home', {
        title : 'Home Page',
        user : JSON.stringify(obj),
        name : req.user.name,
        image : req.user.image
    });
}

module.exports.adminHome = (req, res) => {
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {
      console.log('Error in loading all the users');
      return;
    }
    for (var i in users) {
      if (!users[i]['type']) {
        //console.log(users[i], users[i]['type']);
        studentList.push(users[i]);
      }
    }
    //console.log(JSON.stringify(studentList));
    //console.log(typeof(studentList));
    return res.render('admin_home', {
      title : 'Admin - Home',
      studentList : JSON.stringify(studentList),
      adminName : getAdminName(req.user.email),
      id : req.user._id
    })
  })
}

module.exports.studentList = (req, res) => {
    return res.render('student_list', {
        'title' : 'No-Dues List'
    });
}

module.exports.sendMessage = (req, res) => {
  var obj = JSON.parse(req.params.dues)
  console.log(obj);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {
      console.log('Error in finding student from email id');
      return;
    }
    var id = user._id;
    var attribute = obj[0].admin + "Message";
    console.log(id, attribute);
    User.findByIdAndUpdate(id, {designLabMessage : obj[0].message}, (err, user) => {
      user.save();
      console.log(user);
      return res.redirect('/admin_home');
    })
  })
  return;
}

module.exports.approveDues = (req, res) => {
  var obj = JSON.parse(req.params.dues)
  console.log(obj);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {
      console.log('Error in finding student from email id');
      return;
    }
    var id = user._id;
    User.findByIdAndUpdate(id, {designLab : true}, (err, user) => {
      user.save();
      console.log(user);
      return res.redirect('/admin_home');
    })
  })
  return;
}