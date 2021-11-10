const User = require('../models/user');
const {google} = require('googleapis');
const message_mailer = require('../mailers/message_mailer');
const approved_mailer = require('../mailers/approved_mailer');
const sendBtpRequest_mailer = require('../mailers/sendBtpRequest_mailer');
const sendIpRequest_mailer = require('../mailers/sendIpRequest_mailer');
const btpApproved_mailer = require('../mailers/btpApproved_mailer');
const sendBtpMessage_mailer = require('../mailers/sendBtpMessage_mailer');
const boysHostelNodues_mailer = require('../mailers/boysHostelNodues_mailer');
const girlsHostelNodues_mailer = require('../mailers/girlsHostelNodues_mailer');
const getAdminName = require('../data/getAdminName');
const admins = require('../data/admins.json');

updateBoysNoDuesSheet = async () => {
  var spreadsheetId = "1i4S4fbsVjBmpod-qplGgIH0BAhW_DsSj2B_2k0aHvaQ";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({version: "v4", auth: client});
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    })
    //console.log(metadata.data);
    var data = await googleSheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    //console.log("found the data =============>>>>>>>>>>>");
    var boyshosteldata = data.data.values;
    var newboyshosteldata = [];
    newboyshosteldata.push(boyshosteldata[0]);
    User.find({}, (err, users) => {
      if (err) {console.log('Error in loading all the users'); return;}
      for (var i=1; i<boyshosteldata.length; i++) {
        for (var j in users) {
          if (boyshosteldata[i][0]==users[j]['name'] && users[j]['hostel']==false) {
            newboyshosteldata.push(boyshosteldata[i]);
          }
        }
      }
      for (var i in users) {
        var c = 0;
        for (var j=1; j<boyshosteldata.length; j++) {
          if (users[i]['name'] == boyshosteldata[j][0]) {c=c+1;}
        }
        if (c==0 && users[i]['type']!='Admin' && users[i]['type']!='Proff') {
          temp = [];
          temp.push(users[i]['name']);
          ind = users[i]['email'].indexOf('@');
          temp.push('20'+users[i]['email'].substring(ind-5,ind));
          temp.push(users[i]['email']);
          temp.push('');
          newboyshosteldata.push(temp);
        }
      }
    });

    var spreadsheetId = "1i4S4fbsVjBmpod-qplGgIH0BAhW_DsSj2B_2k0aHvaQ";
    var auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    var client = await auth.getClient();
    var googleSheets = google.sheets({version: "v4", auth: client});
    var metadata = await googleSheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: spreadsheetId
    })
    //console.log(metadata.data);
    await googleSheets.spreadsheets.values.clear({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: "Sheet1"
    });
    console.log(newboyshosteldata);
    await googleSheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
          values: newboyshosteldata
      }
  });
}

module.exports.home = (req, res) => {
  var obj = [];
  console.log(admins);
  obj.push(req.user);
    return res.render('home', {
        title : 'Home Page',
        user : JSON.stringify(obj),
        name : req.user.name,
        image : req.user.image,
        admins: JSON.stringify(admins)
    });
}

module.exports.adminHome = (req, res) => {
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {console.log('Error in loading all the users'); return;}
    for (var i in users) {
      if (!users[i]['type']) {
        studentList.push(users[i]);
      }
    }
    return res.render('admin_home', {
      title : 'Admin - Home',
      studentList : JSON.stringify(studentList),
      adminName : getAdminName.getAdminName(req.user.email),
      id : req.user._id
    })
  })
}

module.exports.superAdmin = (req, res) => {
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {console.log('Error in loading all the users'); return;}
    for (var i in users) {
      if (!users[i]['type']) {
        studentList.push(users[i]);
      }
    }
    return res.render('admin_home', {
      title : 'Admin - Home',
      studentList : JSON.stringify(studentList),
      adminName : getAdminName.getAdminName(req.user.email),
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
    if (err) {console.log('Error in finding student from email id'); return;}
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
  var obj = JSON.parse(req.params.dues);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {console.log('Error in finding student from email id'); return;}
    var id = user._id;
    var updateObject = {};
    updateObject[obj[0].admin] = true
    User.findByIdAndUpdate(id, updateObject, (err, user) => {
      user.save();
      return res.redirect('/admin_home');
    });
    approved_mailer.approvedDues(obj[0].admin, obj[0].email);
    updateBoysNoDuesSheet();
  });
  return;
}

module.exports.approveManyDues = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];
  for (var i in obj) {
    var studentEmail = obj[i].studentEmail;
    var adminName = obj[i].adminName;
    var updateObject = {};
    updateObject[adminName] = true;
    User.findOneAndUpdate({email: studentEmail}, updateObject, (err, user) => {
      user.save();
    });
  }
  return res.redirect('/admin_home');
}

module.exports.proffHome = (req, res) => {
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {console.log('Error in loading all the users'); return;}
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
  User.findOne({email : obj[0]['studentEmail']}, (err, user) => {
    if (err) {console.log('Error in finding student in sendBtpRequest: ', err); return;}
    var id = user._id;
    User.findByIdAndUpdate(id, {'btp': obj[0]['proffEmail']}, (err, user) => {
      if (err) {console.log('Error in saving proffEmail in sendBtpRequest: ', err); return;}
      user.save();
    });
    sendBtpRequest_mailer.sendBtpRequest(obj[0]['proffEmail'], obj[0]['studentEmail']);
  })
  return res.redirect('/');
}

module.exports.sendMessageBtp = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  console.log(obj);
  var studentEmail = obj[0]['email'];
  var proffEmail = obj[0]['proffEmail'];
  var message = obj[0]['message'];
  User.findOneAndUpdate({email : studentEmail}, {'btpMessage': message}, (err, user) => {
    if (err) {console.log('Error in finding student in sendMessageBtp: ', err); return;}
    user.save();
    sendBtpMessage_mailer.sendBtpMessage_mailer(message, studentEmail, proffEmail);
    return res.redirect('/proff_home');
  });
}

module.exports.btpApproved = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  User.findByIdAndUpdate(obj[0]['id'], {btpApproved : true}, (err, user) => {
    if (err) {console.log('Error finding user in btpApproved: ', err); return;}
    user.save();
    btpApproved_mailer.btpApproved_mailer(obj[0]['proffEmail'], obj[0]['email']);
    return res.redirect('/proff_home');
  });
}

module.exports.sendIpRequest = (req, res) => {
  var obj = JSON.parse(req.params.obj);
  User.findOneAndUpdate({email : obj[0]['studentEmail']}, {'ip': obj[0]['proffEmail']}, (err, user) => {
    if (err) {console.log('Error in finding student in sendBtpRequest: ', err); return;}
    user.save();
    sendIpRequest_mailer.sendIpRequest(obj[0]['proffEmail'], obj[0]['studentEmail'])
  });
  return res.redirect('/');
}

module.exports.sendMessageIp = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  var studentEmail = obj[0]['email'];
  var message = obj[0]['message'];
  User.findOneAndUpdate({email : studentEmail}, {'ipMessage': message}, (err, user) => {
    if (err) {console.log('Error in finding student in sendMessageIp: ', err); return;}
    user.save();
    return res.redirect('/proff_home');
  });
}

module.exports.ipApproved = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  User.findByIdAndUpdate(obj[0]['id'], {ipApproved : true}, (err, user) => {
    if (err) {console.log('Error finding user in ipApproved: ', err); return;}
    user.save();
    return res.redirect('/proff_home');
  });
}

module.exports.download = (req, res) => {
  // var student = JSON.parse(req.params.student)[0];
  // console.log(student);
  return res.render('pdf');
};

module.exports.past = (req, res) => {
  var admin = JSON.parse(req.params.admin)[0]['admin'];
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {console.log('Error in loading all the users'); return;}
    for (var i in users) {
      if (!users[i]['type']) {
        studentList.push(users[i]);
      }
    }
    return res.render('admin_past', {
      studentList : JSON.stringify(studentList),
      admin : admin
    })
  });
}

module.exports.sendBankDetails = (req, res) => {
  var obj = JSON.parse(req.params.bankDetails);
  console.log(obj);
  var updateObject = {};
  updateObject.bankName = obj.bankName;
  updateObject.bankBranch = obj.bankBranch;
  updateObject.bankAccountNo = obj.bankAccountNo;
  updateObject.bankIfscCode = obj.bankIfscCode;
  User.findOneAndUpdate({email : obj['email']}, updateObject, (err, user) => {
    if (err) {console.log('Error in finding student in sendBtpRequest: ', err); return;}
    user.save();
  });
  return res.redirect('/');
}

module.exports.sheet = (req, res) => {
  return res.redirect('https://docs.google.com/spreadsheets/d/1yapIMuyvzPVX5Sy3n5p5kLJH5aqWdnLBoLbaw4AsVi8/edit?usp=sharing');
}

module.exports.bankAccountDetails = (req, res) => {
  return res.redirect('https://docs.google.com/spreadsheets/d/1jKQsMLiwSW5KwcKP1uxL-cnpMFWG_gv9FP2fz3Ha3t4/edit?usp=sharing');
}

module.exports.sendMailToBoysHostelAdmin = async (req, res) => {
    //console.log("inside sendMailToBoysHostelAdmin =============>>>>>>>>>>>");
    updateBoysNoDuesSheet();
  boysHostelNodues_mailer.boysHostelNodues_mailer('soumyadeepsp@gmail.com');
  return res.redirect('/admin_home');
}

module.exports.sendMailToGirlsHostelAdmin = (req, res) => {
  updateGirlsNoDuesSheet();
  girlsHostelNodues_mailer.girlsHostelNodues_mailer('soumyadeepsp@gmail.com');
  return res.redirect('/admin_home');
}

module.exports.request = (req, res) => {
  var obj = JSON.parse(req.params.obj)[0];
  console.log(obj);
  var studentEmail = obj.studentEmail;
  var adminName = obj.adminName;
  console.log(studentEmail, adminName);
  var updateObject = {};
  updateObject[adminName+'Applied'] = true;
  User.findOneAndUpdate({email : obj['studentEmail']}, updateObject, (err, user) => {
    if (err) {console.log('Error in updating request status: ', err); return;}
    user.save();
  });
  return res.redirect('/');
}

module.exports.flowchart = (req, res) => {
  return res.render('flowchart');
}

module.exports.flowchart_nd = (req, res) => {
  return res.render('flowchart_nd');
}