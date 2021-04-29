const User = require('../models/user');
const message_mailer = require('../mailers/message_mailer');
const approved_mailer = require('../mailers/approved_mailer');
const sendBtpRequest_mailer = require('../mailers/sendBtpRequest_mailer');

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
    });
    message_mailer.newMessage(obj[0].message, obj[0].email, obj[0].admin);
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
    });
    approved_mailer.approvedDues(obj[0].admin, obj[0].email);
  })
  return;
}

module.exports.proffHome = (req, res) => {
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {
      console.log('Error in loading all the users');
      return;
    }
    for (var i in users) {
      if (!users[i]['type']) {
        studentList.push(users[i]);
      }
    }
    return res.render('proff_home', {
      title : 'Proff - Home',
      studentList : JSON.stringify(studentList),
      proffEmail : req.user.email,
      id : req.user._id
    })
  })
}

module.exports.sendBtpRequest = (req, res) => {
  var obj = JSON.parse(req.params.obj);
  console.log(obj);
  User.findOne({email : obj[0]['studentEmail']}, (err, user) => {
    if (err) {
      console.log('Error in finding student in sendBtpRequest: ', err);
      return;
    }
    var id = user._id;
    User.findByIdAndUpdate(id, {'btp': obj[0]['proffEmail']}, (err, user) => {
      if (err) {
        console.log('Error in saving proffEmail in sendBtpRequest: ', err);
        return;
      }
      user.save();
      console.log(user);
    });
    sendBtpRequest_mailer.sendBtpRequest(obj[0]['proffEmail'], obj[0]['studentEmail'])
  })
  return res.redirect('/');
}