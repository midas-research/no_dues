const User = require('../models/user');
const {google} = require('googleapis');
const message_mailer = require('../mailers/message_mailer');
const approved_mailer = require('../mailers/approved_mailer');
const super_message_mailer = require('../mailers/super_message_mailer');
const super_approved_mailer = require('../mailers/super_approved_mailer');
const sendBtpRequest_mailer = require('../mailers/sendBtpRequest_mailer');
const sendIpRequest_mailer = require('../mailers/sendIpRequest_mailer');
const btpApproved_mailer = require('../mailers/btpApproved_mailer');
const ipApproved_mailer = require('../mailers/ipApproved_mailer');
const sendBtpMessage_mailer = require('../mailers/sendBtpMessage_mailer');
const sendIpMessage_mailer = require('../mailers/sendIpMessage_mailer');
const boysHostelNodues_mailer = require('../mailers/boysHostelNodues_mailer');
const girlsHostelNodues_mailer = require('../mailers/girlsHostelNodues_mailer');
const getAdminName = require('../data/getAdminName');
const getProffName=require("../data/getProffName");
const admins = require('../data/admins');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
const axios = require('axios');
const {CURRENT_URL,NODEMAILER_EMAIL_ID}= require('../config/config');


function modifyAdminName(s) {
  if (s.substring(0, 9) == 'Academics') {
    return 'academics';
  }
  var arr = s.split(" ");
  var newName = arr[0].toLowerCase();
  for (var i=1; i<arr.length; i++) {
      if (arr[i]=='&' || arr[i]=='&amp;') {
          arr[i] = 'and';
      }
      newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1,);
  }
  return newName;
}

//Super Admin Operations
module.exports.superAdmin = (req, res) => {
  var admins_list=[];
  for (var i=0; i<admins.length-2; i++) {
    admins_list.push(modifyAdminName(admins[i][0]));
  }
  admins_list.push('ip');
  admins_list.push('btp');
  
  
  var studentList = []
  User.find({}, (err, users) => {
    if (err) {console.log('Error in loading all the users'); return;}
    for (var i in users) {
      if (!users[i]['type']) {
        studentList.push(users[i]);
      }
    }
    // console.log(admins_list);
    // console.log(studentList);
    return res.render('super_admin', {
      title : 'Super-Admin',
      studentList : JSON.stringify(studentList),
      adminList :  JSON.stringify(admins_list),
      adminName: 'nodues',
      id : req.user._id,
      url: JSON.stringify(CURRENT_URL)
    })
  })
}

module.exports.superSendMessage = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  console.log(obj);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {console.log('Error in finding student from email id'); return;}
    var id = user._id;
    var attribute = obj[0].admin + "Message";
    var updatedObject = {};
    updatedObject[obj[0].admin] = false;
    updatedObject[attribute] = obj[0].message;
    updatedObject[obj[0].admin+"ApprovedAt"]=null;

    console.log(id, attribute);
    User.findByIdAndUpdate(id, updatedObject, (err, user) => {
      user.save();
      return res.redirect('/super_admin');
    });
    super_message_mailer.newMessage(obj[0].message, obj[0].email);
  })
  return;
}

module.exports.superApproveDues = (req, res) => {
  console.log("Entered super approve");
  var obj = JSON.parse(req.params.dues);
  User.findOne({email : obj[0].email}, (err, user) => {

    if (err) {console.log('Error in finding student from email id'); return;}

    var id = user._id;
    var updateObject = {};
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[obj[0].admin] = true;
    updateObject[obj[0].admin+'ApprovedAt'] = dateTime;
    
    User.findByIdAndUpdate(id, updateObject, (err, user) => {
      user.save();
      return res.redirect('/super_admin');
    });
    super_approved_mailer.approvedDues(obj[0].email);
    // updateBoysNoDuesSheet();
  });
  return;
}

module.exports.superApproveManyDues = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];
  for (var i in obj) {
    var studentEmail = obj[i].studentEmail;
    var adminName = obj[i].adminName;
    var updateObject = {};
    updateObject[adminName] = true;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[adminName+'ApprovedAt'] = dateTime;

    User.findOneAndUpdate({email: studentEmail}, updateObject, (err, user) => {
      user.save();
      super_approved_mailer.approvedDues(studentEmail);
    });
  }
  // updateBoysNoDuesSheet();
  return res.redirect('/super_admin');
}

// Super Admin Department Wise

module.exports.superAdminDepartment = (req, res) => {
  var admins_list=[];
  for (var i=0; i<admins.length-2; i++) {
    admins_list.push(modifyAdminName(admins[i][0]));
  }
  // admins_list.push('ip');
  // admins_list.push('btp');

  var studentList = []
  User.find({}, (err, users) => {
    if (err) {console.log('Error in loading all the users'); return;}
    for (var i in users) {
      if (!users[i]['type']) {
        studentList.push(users[i]);
      }
    }
    return res.render('super_admin_department', {
      title : 'Requests To Admins',
      studentList : JSON.stringify(studentList),
      adminList :  JSON.stringify(admins_list),
      adminName: 'nodues',
      id : req.user._id,
      url: JSON.stringify(CURRENT_URL)
    })
  })
}

module.exports.sendAdminMessage = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  console.log(obj);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {console.log('Error in finding student from email id'); return;}
    var id = user._id;
    var attribute = obj[0].admin + "Message";
    var updatedObject = {};
    updatedObject[obj[0].admin] = false;
    updatedObject[attribute] = obj[0].message;
    updatedObject[obj[0].admin+"ApprovedAt"]=null;
    
    console.log(id, attribute);
    User.findByIdAndUpdate(id, updatedObject, (err, user) => {
      user.save();
      return res.redirect('/super_admin/adminRequests');
    });
    message_mailer.newMessage(obj[0].message, obj[0].email, obj[0].admin);
  })
  return;
}

module.exports.approveAdmin = (req, res) => {

  var obj = JSON.parse(req.params.dues);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {console.log('Error in finding student from email id'); return;}
    var id = user._id;
    var updateObject = {};
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[obj[0].admin] = true;
    updateObject[obj[0].admin+'ApprovedAt'] = dateTime;
    
    User.findByIdAndUpdate(id, updateObject, (err, user) => {
      user.save();
      return res.redirect('/super_admin/adminRequests');
    });
    approved_mailer.approvedDues(obj[0].admin, obj[0].email);
    updateBoysNoDuesSheet();
  });
  return;
}

module.exports.approveManyAdmins = (req, res) => {

  var obj = JSON.parse(req.params.dues)[0];
  for (var i in obj) {
    var studentEmail = obj[i].studentEmail;
    var adminName = obj[i].adminName;
    var updateObject = {};
    updateObject[adminName] = true;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[adminName+'ApprovedAt'] = dateTime;
    
    
    User.findOneAndUpdate({email: studentEmail}, updateObject, (err, user) => {
      user.save();
      approved_mailer.approvedDues(adminName, studentEmail);
    });
  }
  updateBoysNoDuesSheet();
  return res.redirect('/super_admin/adminRequests');
}


//Admin Operations

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
      adminName : getAdminName.adminNames[req.user.email],
      id : req.user._id,
      url: JSON.stringify(CURRENT_URL)
    });
  })
}

module.exports.sendMessage = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  // console.log(obj);
  User.findOne({email : obj[0].email}, (err, user) => {
    if (err) {console.log('Error in finding student from email id'); return;}
    var id = user._id;
    var attribute = obj[0].admin + "Message";
    var updatedObject = {};
    updatedObject[obj[0].admin] = false;
    updatedObject[attribute] = obj[0].message;
    updatedObject[obj[0].admin+"ApprovedAt"]=null;
    
    // console.log(id, attribute);
    User.findByIdAndUpdate(id, updatedObject, (err, user) => {
      user.save();
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
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[obj[0].admin] = true;
    updateObject[obj[0].admin+'ApprovedAt'] = dateTime;
    
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
    console.log('Hello'+studentEmail);
    var adminName = obj[i].adminName;
    var updateObject = {};
    updateObject[adminName] = true;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[adminName+'ApprovedAt'] = dateTime;
    
    User.findOneAndUpdate({email: studentEmail}, updateObject, (err, user) => {
      user.save();
      approved_mailer.approvedDues(adminName, studentEmail);
    });
  }
  updateBoysNoDuesSheet();
  return res.redirect('/admin_home');
}

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
      admin : admin,
      url: JSON.stringify(CURRENT_URL)
    })
  });
}

module.exports.showSheet = (req, res) => {

  return res.redirect('https://docs.google.com/spreadsheets/d/1zRLMi10k1zxMyv2uygSUhcxSEJsova76t8fBXi3GiSk/edit?usp=sharing'); 
  // return res.render('showSheet',{
  //   url: JSON.stringify(CURRENT_URL)
  // });
  

}

//Professor Operations

module.exports.approveManyProffs = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];
  for (var i in obj) {
    var studentEmail=obj[i].studentEmail;
    var adminName = obj[i].admin;
    var updateObject = {};
    updateObject[adminName] = true;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    updateObject[adminName]=true;
    updateObject[adminName+'ApprovedAt'] = dateTime;
    updateObject[adminName+'Prof']=obj[0]['proffEmail'];
    
    User.findOneAndUpdate({email: studentEmail}, updateObject, (err, user) => {
      if (err) {console.log('Error in saving proffEmail in sendBtpRequest: ', err); return;}
      user.save();
      console.log("saving");
      if(adminName=='btp'){
        btpApproved_mailer.btpApproved_mailer(obj[0]['proffEmail'], obj[0]['studentEmail']);
      }
      if(adminName=='ip'){
        ipApproved_mailer.ipApproved_mailer(obj[0]['proffEmail'], obj[0]['studentEmail']);
      }
      
    });
  }
  return res.redirect('/proff_home');
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
      name: req.user.name,
      proffEmail : req.user.email,
      image : req.user.image,
      id : req.user._id,
      url: JSON.stringify(CURRENT_URL)
    })
  })
}

module.exports.sendMessageBtp = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  var studentEmail = obj[0]['email'];
  var proffEmail = obj[0]['proffEmail'];
  var message = obj[0]['message'];

  var updatedObject = {};
  updatedObject['btp'] = false;
  updatedObject['btpMessage'] = message; 
  
  User.findOneAndUpdate({email : studentEmail},updatedObject, (err, user) => {
    if (err) {console.log('Error in finding student in sendMessageBtp: ', err); return;}
    user.save();
    sendBtpMessage_mailer.sendBtpMessage_mailer(message, studentEmail, proffEmail);
    return res.redirect('/proff_home');
  });
}

module.exports.sendMessageIp = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  var studentEmail = obj[0]['email'];
  var proffEmail = obj[0]['proffEmail'];
  var message = obj[0]['message'];

  var updatedObject = {};
  updatedObject['ip'] = false;
  updatedObject['ipMessage'] = message;
  
  
  
  User.findOneAndUpdate({email : studentEmail},updatedObject, (err, user) => {
    if (err) {console.log('Error in finding student in sendMessageIp: ', err); return;}
    user.save();
    sendIpMessage_mailer.sendIpMessage_mailer(message, studentEmail, proffEmail);
    return res.redirect('/proff_home');
  });
}

module.exports.btpApproved=(req,res)=>{
  var obj = JSON.parse(req.params.dues);
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var updatedObject = {};
  updatedObject['btp'] = true;
  updatedObject['btpApprovedAt'] = dateTime;
  updatedObject['btpProf'] = true;
  
  User.findByIdAndUpdate(obj[0]['id'], updatedObject, (err, user) => {
    if (err) {console.log('Error finding user in btpApproved: ', err); return;}
    user.save();
    btpApproved_mailer.btpApproved_mailer(obj[0]['proffEmail'], obj[0]['email']);
    return res.redirect('/proff_home');
  });

}

module.exports.ipApproved = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var updatedObject = {};
  updatedObject['ipProf'] = obj[0]['proffEmail'];
  updatedObject['ipApprovedAt'] = dateTime;
  updatedObject['ip'] = true;
  
  
  User.findByIdAndUpdate(obj[0]['id'], updatedObject, (err, user) => {
    if (err) {console.log('Error finding user in ipApproved: ', err); return;}
    
    user.save();
    ipApproved_mailer.ipApproved_mailer(obj[0]['proffEmail'], obj[0]['email']);
    return res.redirect('/proff_home');
  });
}

module.exports.afterMailPage=(req,res)=>{
  var status=req.params.status;

  res.render('afterMailPage',{status: status});
}

module.exports.ipApprovedThroughMail = (req, res)=>{

  var studentId=req.params.studentId;
  var proffEmail=req.params.proffEmail;


  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var updatedObject = {};
  updatedObject['ipProf'] = proffEmail;
  updatedObject['ipApprovedAt'] = dateTime;
  updatedObject['ip'] = true;


  User.findById(studentId, (err, user) => {
    if (err) {console.log('Error finding user in ipApprovedThroughMail: ', err);  return res.redirect('/proff_home');}
   
    if(user.ip!=undefined){
      console.log("Rejected");
      return res.redirect('/ip/btp/error');
    }
    user.set(updatedObject);           
    user.save();
    ipApproved_mailer.ipApproved_mailer(proffEmail, user.email);
    return res.redirect('/ip/btp/success');
  });
}

module.exports.btpApprovedThroughMail = (req, res)=>{

  var studentId=req.params.studentId;
  var proffEmail=req.params.proffEmail;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var updatedObject = {};
  updatedObject['btpProf'] = proffEmail;
  updatedObject['btpApprovedAt'] = dateTime;
  updatedObject['btp'] = true;


  User.findById(studentId, (err, user) => {
    if (err) {console.log('Error finding user in btpApprovedThroughMail: ', err);  return res.redirect('/proff_home');}
    
    if(user.btp!=undefined){
      console.log("Rejected");
      return res.redirect('/ip/btp/error');
    }
    user.set(updatedObject);           
    user.save();
    btpApproved_mailer.btpApproved_mailer(proffEmail, user.email);
   
    return res.redirect('/ip/btp/success');
  });


}

//User Operations

module.exports.home = (req, res) => {
  var obj = [];
  obj.push(req.user);
    return res.render('home', {
        title : 'Home Page',
        user : JSON.stringify(obj),
        name : req.user.name,
        image : req.user.image,
        url:JSON.stringify(CURRENT_URL)
    });
}

module.exports.request = (req, res) => {
  var obj = JSON.parse(req.params.obj)[0];
  console.log(obj);
  var studentEmail = obj.studentEmail;
  var adminName = obj.adminName;
  var hostelTaken=obj.hostelTaken;
  console.log(studentEmail, adminName);
  var updateObject = {};
  updateObject[adminName+'Applied'] = true;
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  updateObject[adminName+'AppliedAt'] = dateTime;
  updateObject['hostelTaken']=hostelTaken;
  User.findOneAndUpdate({email : obj['studentEmail']}, updateObject, (err, user) => {
    if (err) {console.log('Error in updating request status: ', err); return;}
    user.save();
  });
  return res.redirect('/');
}

module.exports.sendBtpRequest = (req, res) => {
  var obj = JSON.parse(req.params.obj);
  User.findOne({email : obj[0]['studentEmail']}, (err, user) => {
    if (err) {console.log('Error in finding student in sendBtpRequest: ', err); return;}
    var id = user._id;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var updatedObject = {};
    updatedObject['btpApplied'] = true;
    updatedObject['btpAppliedAt'] = dateTime;
    updatedObject['btpProf']=obj[0]['proffEmail'];
    updatedObject['btpProjectName']=obj[0]['projectName'];
    updatedObject['btpProjectDescription']=obj[0]['projectDescription'];
    console.log(id);
    User.findByIdAndUpdate(id, updatedObject, (err, user) => {
      if (err) {console.log('Error in saving proffEmail in sendBtpRequest: ', err); return;}
      user.save();
      console.log("saving");
      sendBtpRequest_mailer.sendBtpRequest(obj[0]['proffEmail'], obj[0]['studentEmail'],obj[0]['projectName'], obj[0]['projectDescription']);
    });
    
  })
  return res.redirect('/');
}

module.exports.sendIpRequest = (req, res) => {
  
  var obj = JSON.parse(req.params.obj);
  console.log(obj);
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var updatedObject = {};
  updatedObject['ipApplied'] = true;
  updatedObject['ipAppliedAt'] = dateTime;
  updatedObject['ipProf']=obj[0]['proffEmail'];
  updatedObject['ipProjectName']=obj[0]['projectName'];
  updatedObject['ipProjectDescription']=obj[0]['projectDescription'];

  User.findOneAndUpdate({email : obj[0]['studentEmail']}, updatedObject, (err, user) => {
    if (err) {console.log('Error in finding student in sendBtpRequest: ', err); return;}
    user.save();
    console.log("saving");
    sendIpRequest_mailer.sendIpRequest(obj[0]['proffEmail'], obj[0]['studentEmail'], obj[0]['projectName'], obj[0]['projectDescription'])
  });
  return res.redirect('/');
}

module.exports.download = async (req, res) => {
  var admins_list;
  await axios.get(`${CURRENT_URL}/user/getAdmins`)
  .then(response => {
    admins_list = response.data;
  })
  .catch(error => {
    console.log(error);
  });
  var admins = [];
  for (var i=0; i<admins_list.length-2; i++) {
    admins.push(modifyAdminName(admins_list[i][0]));
  }
  var email = req.params.obj;
  User.findOne({email: email}, (err, user) => {
    if (err) {console.log('Error in finding user in download: ', err);return;}
   
    return res.render('pdf', {
      user: JSON.stringify(user),
      id: JSON.stringify(user._id),
      url:JSON.stringify(CURRENT_URL)
    });
  })
};

module.exports.sendBankDetails = (req, res) => {
  var obj = JSON.parse(req.params.bankDetails);
  console.log(obj);
  var updateObject = {};
  updateObject.bankName = obj.bankName;
  updateObject.bankBranch = obj.bankBranch;
  updateObject.bankAccountNo = obj.bankAccountNo;
  updateObject.bankIfscCode = obj.bankIfscCode;
  updateObject.bankAccountHolder=obj.bankAccountHolder;
  User.findOneAndUpdate({email : obj['email']}, updateObject, (err, user) => {
    if (err) {console.log('Error in finding student in sendBankDetails: ', err); return;}
    user.save();
  });
  return res.redirect('/');
}

module.exports.sendPersonalDetails = (req, res) => {
  var obj = JSON.parse(req.params.personalDetails);
  console.log(obj);
  var updateObject = {};
  updateObject.mobile = obj.personalMobile;
  updateObject.other_email = obj.personalEmail;
  updateObject.date_of_leaving = obj.leavingDate;
  updateObject.reason_of_leaving = obj.leavingReason;
  User.findOneAndUpdate({email : obj['email']}, updateObject, (err, user) => {
    if (err) {console.log('Error in finding student in sendPersonalDetails: ', err); return;}
    user.save();
  });
  return res.redirect('/');
}



//Unknown Operations

module.exports.sheet = (req, res) => {
  return res.redirect('https://docs.google.com/spreadsheets/d/1zRLMi10k1zxMyv2uygSUhcxSEJsova76t8fBXi3GiSk/edit?usp=sharing');
}
module.exports.bankAccountDetails = (req, res) => {
  return res.redirect('https://docs.google.com/spreadsheets/d/1Fn5EplhqwEB5c0chYqhhWCal5Kzs7hT4zNFCwkAkZpE/edit?usp=sharing');
}
module.exports.sendMailToBoysHostelAdmin = async (req, res) => {
    //console.log("inside sendMailToBoysHostelAdmin =============>>>>>>>>>>>");
    updateBoysNoDuesSheet();
  boysHostelNodues_mailer.boysHostelNodues_mailer(`${NODEMAILER_EMAIL_ID}`);
  return res.redirect('/admin_home');
}
module.exports.sendMailToGirlsHostelAdmin = (req, res) => {
  updateGirlsNoDuesSheet();
  girlsHostelNodues_mailer.girlsHostelNodues_mailer(`${NODEMAILER_EMAIL_ID}`);
  return res.redirect('/admin_home');
}
module.exports.flowchart = (req, res) => {
  return res.render('flowchart');
}
module.exports.flowchart_nd = (req, res) => {
  return res.render('flowchart_nd');
}
module.exports.nd_controls = (req, res) => {
  return res.render('nd_controls');
}
module.exports.getFunction = (req, res) => {
  // console.log(getAdminName.adminNames);
  return res.status(200).json(getAdminName.adminNames);
}
updateBoysNoDuesSheet = async () => {
  // var spreadsheetId = "1Tk6j9MmqSBOclnMr5XIQ1qGBa_pFXvjfKPmB9QCAG4o";
  //   var auth = new google.auth.GoogleAuth({
  //       keyFile: "credentials.json",
  //       scopes: "https://www.googleapis.com/auth/spreadsheets"
  //   });
  //   var client = await auth.getClient();
  //   var googleSheets = google.sheets({version: "v4", auth: client});
  //   var metadata = await googleSheets.spreadsheets.get({
  //       auth: auth,
  //       spreadsheetId: spreadsheetId
  //   })
  //   //console.log(metadata.data);
  //   var data = await googleSheets.spreadsheets.values.get({
  //       auth: auth,
  //       spreadsheetId: spreadsheetId,
  //       range: "Sheet1"
  //   });
  //   //console.log("found the data =============>>>>>>>>>>>");
  //   var boyshosteldata = data.data.values;
  //   var newboyshosteldata = [];
  //   // newboyshosteldata.push(boyshosteldata[0]);
  //   User.find({}, (err, users) => {
  //     if (err) {console.log('Error in loading all the users'); return;}
  //     for (var i=1; i<boyshosteldata.length; i++) {
  //       for (var j in users) {
  //         if (boyshosteldata[i][0]==users[j]['name'] && users[j]['hostel']==false) {
  //           newboyshosteldata.push(boyshosteldata[i]);
  //         }
  //       }
  //     }
  //     for (var i in users) {
  //       var c = 0;

  //       //checking if user in boyshosteldata
  //       for (var j=1; j<boyshosteldata.length; j++) {
  //         if (users[i]['name'] == boyshosteldata[j][0]) {c=c+1;}
  //       }
  //       if (c==0 && users[i]['type']!='Admin' && users[i]['type']!='Proff') {
  //         temp = [];
  //         temp.push(users[i]['name']);
  //         ind = users[i]['email'].indexOf('@');
  //         temp.push('20'+users[i]['email'].substring(ind-5,ind));
  //         temp.push(users[i]['email']);
  //         temp.push('');
  //         newboyshosteldata.push(temp);
  //       }
  //     }
    // }
    // );

  //   var spreadsheetId = "1Tk6j9MmqSBOclnMr5XIQ1qGBa_pFXvjfKPmB9QCAG4o";
  //   var auth = new google.auth.GoogleAuth({
  //       keyFile: "credentials.json",
  //       scopes: "https://www.googleapis.com/auth/spreadsheets"
  //   });
  //   var client = await auth.getClient();
  //   var googleSheets = google.sheets({version: "v4", auth: client});
  //   var metadata = await googleSheets.spreadsheets.get({
  //       auth: auth,
  //       spreadsheetId: spreadsheetId
  //   })
    
  //   await googleSheets.spreadsheets.values.clear({
  //       auth: auth,
  //       spreadsheetId: spreadsheetId,
  //       range: "Sheet1"
  //   });
  //   console.log(newboyshosteldata);
  //   await googleSheets.spreadsheets.values.append({
  //     auth: auth,
  //     spreadsheetId: spreadsheetId,
  //     range: "Sheet1",
  //     valueInputOption: "USER_ENTERED",
  //     resource: {
  //         values: newboyshosteldata
  //     }
  // });
}
module.exports.studentList = (req, res) => {
    return res.render('student_list', {
        'title' : 'No-Dues List'
    });
}


