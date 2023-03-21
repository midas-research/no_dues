const User = require("../models/user");
const Admin = require("../models/admin");
const { google } = require("googleapis");
const message_mailer = require("../mailers/message_mailer");
const approved_mailer = require("../mailers/approved_mailer");
const super_message_mailer = require("../mailers/super_message_mailer");
const super_approved_mailer = require("../mailers/super_approved_mailer");
const sendBtpRequest_mailer = require("../mailers/sendBtpRequest_mailer");
const sendIpRequest_mailer = require("../mailers/sendIpRequest_mailer");
const btpApproved_mailer = require("../mailers/btpApproved_mailer");
const ipApproved_mailer = require("../mailers/ipApproved_mailer");
const sendBtpMessage_mailer = require("../mailers/sendBtpMessage_mailer");
const sendIpMessage_mailer = require("../mailers/sendIpMessage_mailer");
const getAdminName = require("../data/getAdminName");
const getProffName = require("../data/getProffName");
const admins = require("../data/admins");
var XMLHttpRequest = require("xhr2");
var xhr = new XMLHttpRequest();
const axios = require("axios");
const { CURRENT_URL, NODEMAILER_EMAIL_ID } = require("../config/config");
const fs = require("fs");


//Super Admin Operations
module.exports.superAdmin = (req, res) => {
  var admins_list = Admin.admins;
  
  return res.render("super_admin", {
    title: "Super-Admin",
    adminList: JSON.stringify(admins_list),
    adminName: "nodues",
    id: req.user._id,
    url: JSON.stringify(CURRENT_URL),
    layout: "super_admin",
  });
};

module.exports.superSendMessage = (req, res) => {
  var obj = JSON.parse(req.params.dues);

  User.findOne({ email: obj[0].email }, (err, user) => {
    if (err) {
      console.log("Error in finding student from email id");
      return;
    }
    var id = user._id;
    var attribute = obj[0].admin + "Message";
    var updatedObject = {};
    updatedObject[obj[0].admin] = false;
    updatedObject[attribute] = obj[0].message;
    updatedObject[obj[0].admin + "ApprovedAt"] = null;

    User.findByIdAndUpdate(id, updatedObject, (err, user) => {
      user.save();
    });
    super_message_mailer.newMessage(obj[0].message, obj[0].email);
    res.status = 200;
    return res.end();
  });
};

module.exports.superApproveDues = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  User.findOne({ email: obj[0].email }, (err, user) => {
    if (err) {
      console.log("Error in finding student from email id");
      return;
    }

    var id = user._id;
    var updateObject = {};
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    updateObject[obj[0].admin] = true;
    updateObject[obj[0].admin + "ApprovedAt"] = dateTime;

    User.findByIdAndUpdate(id, updateObject, (err, user) => {
      user.save();
    });
    super_approved_mailer.approvedDues(obj[0].email);
    res.status = 200;
    return res.end();
  });
  return;
};

module.exports.superApproveManyDues = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];
 
  for (var i in obj) {
  
    var studentEmail = obj[i].studentEmail;
    var adminName = obj[i].adminName;
    var updateObject = {};
    updateObject[adminName] = true;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    updateObject[adminName + "ApprovedAt"] = dateTime;

    User.findOneAndUpdate(
      { email: studentEmail },
      updateObject,
      (err, user) => {
        if (err) {
          console.log("Error in Approving many Dues by SuperAdmin");
          
        }
        user.save();
        super_approved_mailer.approvedDues(studentEmail);
      }
    );
  }
  res.status = 200;
  return res.end();
};

module.exports.updateAccess = (req, res) => {
  
  return res.render("updateAccess", {
    title: "Update Access",
    adminName: "nodues",
    studentURL: JSON.stringify(
      "https://docs.google.com/spreadsheets/d/1NfsIc8CO7n4CvqkmtmGhoOQgL7lGKAmlbk3konSuCxY/edit?usp=sharing"
    ),
    adminURL: JSON.stringify(
      "https://docs.google.com/spreadsheets/d/1hXUEUHWGt3TyrhvWPh25U8KlmutxcTVx2qfAdPHyCEY/edit?usp=sharing"
    ),
    professorURL: JSON.stringify(
      "https://docs.google.com/spreadsheets/d/1L-mCmog-GlNVKQlV_6Jvo9WyQKZpr-S346ijUlPj0gM/edit?usp=sharing"
    ),
    id: req.user._id,
    url: JSON.stringify(CURRENT_URL),
    layout: "updateAccess",
  });

};

module.exports.updateAdmin=async (req,res)=>{
  var admins_data;

  var spreadsheetId = "1hXUEUHWGt3TyrhvWPh25U8KlmutxcTVx2qfAdPHyCEY";
  var auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  var client= await auth.getClient();
  var googleSheets = google.sheets({ version: "v4", auth: client });
  var metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });
  var data = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
  });
  admins_data = data.data.values;
  

  fs.readFile(`data/admins.json`, (err, data) => {
    if (err) {
      console.log("Error in reading admins file: ", err);
      return;
    }
 
    if (data != JSON.stringify(admins_data)) {
      fs.writeFile(
        `data/admins.json`,
        JSON.stringify(admins_data),
        (err) => {
          if (err) {
            console.log("Error in writing to admins file: ", err);
            return;
          }
        }
      );
      
    }
  });
  Admin.db.collection.drop();
  Admin.addAdmins(admins_data);
  res.status = 200;
  return res.end();
}

module.exports.updateStudent = async (req, res) => {
  var spreadsheetId = "1NfsIc8CO7n4CvqkmtmGhoOQgL7lGKAmlbk3konSuCxY";
  var auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  var client = await auth.getClient();
  var googleSheets = google.sheets({ version: "v4", auth: client });
  var metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });
  var data = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
  });
  students_data = data.data.values;
  fs.readFile("data/students.json", (err, data) => {
    if (err) {
      console.log("Error in writing to admins file: ", err);
      return;
    }
    if (data != JSON.stringify(students_data)) {
      fs.writeFile(
        "data/students.json",
        JSON.stringify(students_data),
        (err) => {
          if (err) {
            console.log("Error in writing to admins file: ", err);
            return;
          }
        }
      );
    }
  });

  res.status = 200;
  return res.end();
};

module.exports.updateProfessor = async (req, res) => {
  var spreadsheetId = "1L-mCmog-GlNVKQlV_6Jvo9WyQKZpr-S346ijUlPj0gM";
  var auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  var client = await auth.getClient();
  var googleSheets = google.sheets({ version: "v4", auth: client });
  var metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });
  var data = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
  });
  professors_data = data.data.values;
  professors_data.shift();
  fs.readFile("data/professors.json", (err, data) => {
    if (err) {
      console.log("Error in writing to admins file: ", err);
      return;
    }
    if (data != JSON.stringify(professors_data)) {
      fs.writeFile(
        "data/professors.json",
        JSON.stringify(professors_data),
        (err) => {
          if (err) {
            console.log("Error in writing to admins file: ", err);
            return;
          }
        }
      );
    }
  });
  var proffNames = {};
  for (var i in professors_data) {
    if(i==0){
      continue;
    }
    proffNames[professors_data[i][1]] = professors_data[i][0];
  }
  var text = `    
    const getProffName = (email) => {
        return proffNames[email];
    }

    module.exports.proffNames = proffNames;

    const isProff = (email) => {
        
        if (email in proffNames) {
            return true;
        } else {
            return false;
        }
    } 
    module.exports={getProffName,isProff}; 
    `;

  fs.writeFile(
    "data/getProffName.js",
    "var proffNames = " + JSON.stringify(proffNames) + "\n" + text,
    (err) => {
      if (err) {
        console.log("Error in writing to admins file: ", err);
        return;
      }
    }
  );
  res.status = 200;
  return res.end();
};


// Super Admin Department Wise

module.exports.superAdminDepartment = (req, res) => {
  var admins_list = Admin.admins;

  let originalName = Admin.original;

  originalName["academics"] = "Academics";

  return res.render("super_admin_department", {
    title: "Requests To Admins",
    adminList: JSON.stringify(admins_list),
    adminName: "nodues",
    originalName: JSON.stringify(originalName),
    id: req.user._id,
    url: JSON.stringify(CURRENT_URL),
    layout: "super_admin_department",
  });
};

//Admin Operations


module.exports.adminHome = (req, res) => {
  var studentList = [];
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in loading all the users");
      return;
    }
    for (var i in users) {
      if (!users[i]["type"]) {
        studentList.push(users[i]);
      }
    }
    let admin = Admin.findAdmin(req.user.email);
    let originalName = Admin.getOriginalAdmin(admin);

    if (admin.substring(0, 9) == "academics") {
      admin = "academics";
    }
  

    return res.render("admin_home", {
      title: "Admin - Home",
      originalName: originalName,
      adminName: JSON.stringify(admin),
      url: JSON.stringify(CURRENT_URL),
      layout: "admin_home",
    });
  });
};

module.exports.sendMessage = (req, res) => {
  var obj = JSON.parse(req.params.dues);

  User.findOne({ email: obj[0].email }, (err, user) => {
   
    if (err) {
      console.log("Error in finding student from email id");

      return;
    }
    var id = user._id;
   
    var msg = obj[0].admin + "Message";
    var fine=obj[0].admin+"Fine";

    
    var updatedObject = {};
    updatedObject[obj[0].admin] = false;
    updatedObject[msg] = obj[0].message;
    updatedObject[fine] = obj[0].fine;
    updatedObject['totalFine']=user.totalFine+fine;
    updatedObject[obj[0].admin + "ApprovedAt"] = null;

    User.findByIdAndUpdate(id, updatedObject, (err, user) => {
      user.save();
    });
    if (obj[0].admin == "academics") {
      obj[0].admin += user.degree[0];
    }

    message_mailer.newMessage(obj[0].message, obj[0].email, obj[0].admin);

    res.status = 200;
    return res.end();
  });
};

module.exports.approveDues = (req, res) => {
  var obj = JSON.parse(req.params.dues);

  User.findOne({ email: obj[0].email }, (err, user) => {
    if (err) {
      console.log("Error in finding student from email id");
      return;
    }
    var id = user._id;
    var updateObject = {};
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    updateObject[obj[0].admin] = true;
    updateObject[obj[0].admin + "ApprovedAt"] = dateTime;

    User.findByIdAndUpdate(id, updateObject, (err, user) => {
      user.save();
    });
    if (obj[0].admin == "academics") {
      obj[0].admin += user.degree[0];
    }
    approved_mailer.approvedDues(obj[0].admin, obj[0].email);
    res.status = 200;
    return res.end();
  });
};

module.exports.approveManyDues = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];

  for (var i in obj) {
    var studentEmail = obj[i].studentEmail;
    var adminName = obj[i].adminName;
    var updateObject = {};
    updateObject[adminName] = true;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    updateObject[adminName + "ApprovedAt"] = dateTime;

    User.findOneAndUpdate(
      { email: studentEmail },
      updateObject,
      (err, user) => {
        if (err) {
          console.log("Error in Approving many Dues by Admin");
        }
        user.save();
        if (adminName == "academics") {
          adminName += user.degree[0];
        }
        approved_mailer.approvedDues(adminName, studentEmail);
      }
    );
  }

  res.status = 200;
  return res.end();
};

module.exports.past = (req, res) => {
  var admin = JSON.parse(req.params.admin)[0]["admin"];
  var studentList = [];
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in loading all the users");
      return;
    }
    for (var i in users) {
      if (!users[i]["type"]) {
        studentList.push(users[i]);
      }
    }
    return res.render("admin_past", {
      studentList: JSON.stringify(studentList),
      admin: admin,
      url: JSON.stringify(CURRENT_URL),
      layout: "admin_past",
    });
  });
};

module.exports.showSheet = (req, res) => {
  return res.redirect(
    "https://docs.google.com/spreadsheets/d/1zRLMi10k1zxMyv2uygSUhcxSEJsova76t8fBXi3GiSk/edit?usp=sharing"
  );
};

//Professor Operations

module.exports.approveEmailProf = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];

  var studentEmail = obj.studentEmail;
  var adminName = obj.admin;
  var projectName = obj.projectName;
  var profEmail = obj.profEmail;

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  User.findOne({ email: studentEmail }, (err, user) => {
    if (err) {
      console.log("Error in saving profEmail in approveManyProff: ", err);
      return;
    }

    for (var idx in user[`${adminName}List`]) {
      var ipObj = user[`${adminName}List`][idx];

      if (
        ipObj[`projectName`] == projectName &&
        ipObj[`profEmail`] == profEmail
      ) {
        user[`${adminName}List`][idx][adminName] = true;
        user[`${adminName}List`][idx][adminName + "ApprovedAt"] = dateTime;
        user.save();

        if (adminName == "btp") {
          btpApproved_mailer.btpApproved_mailer(
            obj["profEmail"],
            obj["studentEmail"],
            idx
          );
        }
        if (adminName == "ip") {
          ipApproved_mailer.ipApproved_mailer(
            obj["profEmail"],
            obj["studentEmail"],
            idx
          );
        }

        res.status = 200;
        res.end();
      }
    }
  });
};

module.exports.proffHome = (req, res) => {
  var studentList = [];
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in loading all the users");
      return;
    }

    return res.render("proff_home", {
      title: "Proff - Home",
      name: req.user.name,
      profEmail: req.user.email,
      image: req.user.image,
      url: JSON.stringify(CURRENT_URL),
      layout: "proff_home",
    });
  });
};

module.exports.sendMessageBtp = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  var studentEmail = obj[0]["email"];
  var profEmail = obj[0]["profEmail"];
  var message = obj[0]["message"];
  var idx = obj[0]["idx"];

  User.findOne({ email: studentEmail }, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendMessageBtp: ", err);
      return;
    }

    user["btpList"][idx]["btp"] = false;
    user["btpList"][idx]["btpMessage"] = message;

    user.save();
    sendBtpMessage_mailer.sendBtpMessage_mailer(
      message,
      studentEmail,
      profEmail,
      idx
    );
    res.status = 200;
    return res.end();
  });
};

module.exports.sendMessageIp = (req, res) => {
  var obj = JSON.parse(req.params.dues);
  var studentEmail = obj[0]["email"];
  var profEmail = obj[0]["profEmail"];
  var message = obj[0]["message"];
  var idx = obj[0]["idx"];

  User.findOne({ email: studentEmail }, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendMessageIp: ", err);
      return;
    }

    user["ipList"][idx]["ip"] = false;
    user["ipList"][idx]["ipMessage"] = message;

    user.save();
    sendIpMessage_mailer.sendIpMessage_mailer(
      message,
      studentEmail,
      profEmail,
      idx
    );
    res.status = 200;
    return res.end();
  });
};

module.exports.btpApproved = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  var idx = obj["idx"];
  var studentEmail = obj["email"];

  User.findOne({ email: studentEmail }, (err, user) => {
    if (err) {
      console.log("Error in finding student in btpApproved: ", err);
      return;
    }

    user["btpList"][idx]["btp"] = true;
    user["btpList"][idx]["btpApprovedAt"] = dateTime;
    user["btpList"][idx]["profEmail"] = obj["profEmail"];

    user.save();
    btpApproved_mailer.btpApproved_mailer(obj["profEmail"], obj["email"], idx);
    res.status = 200;
    return res.end();
  });
};

module.exports.ipApproved = (req, res) => {
  var obj = JSON.parse(req.params.dues)[0];
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  var idx = obj["idx"];
  var studentEmail = obj["email"];

  User.findOne({ email: studentEmail }, (err, user) => {
    if (err) {
      console.log("Error in finding student in ipApproved: ", err);
      return;
    }

    user["ipList"][idx]["ip"] = true;
    user["ipList"][idx]["ipApprovedAt"] = dateTime;
    user["ipList"][idx]["profEmail"] = obj["profEmail"];

    user.save();
    ipApproved_mailer.ipApproved_mailer(obj["profEmail"], obj["email"], idx);
    res.status = 200;
    return res.end();
  });
};

module.exports.afterMailPage = (req, res) => {
  var status = req.params.status;

  res.render("afterMailPage", { title: "No Dues",status: status, layout: "afterMailPage" });
};

module.exports.ipApprovedThroughMail = (req, res) => {
  var studentId = req.params.studentId;
  var profEmail = req.params.profEmail;
  var idx = req.params.idx;

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  User.findById(studentId, (err, user) => {
    if (err) {
      console.log("Error finding user in ipApprovedThroughMail: ", err);
      return res.redirect("/proff_home");
    }
    var ipObj = user["ipList"][idx];

    if (ipObj["ip"] != undefined) {
      return res.redirect("/ip/btp/error");
    }
    user["ipList"][idx]["ip"] = true;
    user["ipList"][idx]["ipApprovedAt"] = dateTime;
    user["ipList"][idx]["profEmail"] = profEmail;

    user.save();
    ipApproved_mailer.ipApproved_mailer(profEmail, user.email, idx);
    return res.redirect("/ip/btp/success");
  });
};

module.exports.btpApprovedThroughMail = (req, res) => {
  var studentId = req.params.studentId;
  var profEmail = req.params.profEmail;
  var idx = req.params.idx;

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  User.findById(studentId, (err, user) => {
    if (err) {
      console.log("Error finding user in btpApprovedThroughMail: ", err);
      return res.redirect("/proff_home");
    }
    var btpObj = user["btpList"][idx];

    if (btpObj["btp"] != undefined) {
      return res.redirect("/ip/btp/error");
    }
    user["btpList"][idx]["btp"] = true;
    user["btpList"][idx]["btpApprovedAt"] = dateTime;
    user["btpList"][idx]["profEmail"] = profEmail;

    user.save();
    btpApproved_mailer.btpApproved_mailer(profEmail, user.email, idx);
    return res.redirect("/ip/btp/success");
  });
};

//User Operations

module.exports.home = (req, res) => {
  var obj = [];
  obj.push(req.user);
  return res.render("home", {
    title: "Home Page",
    user: JSON.stringify(obj),
    name: req.user.name,
    image: req.user.image,
    url: JSON.stringify(CURRENT_URL),
    layout: "home",
  });
};

module.exports.home_profile = (req, res) => {
  var obj = [];
  obj.push(req.user);
  return res.render("home_profile", {
    title: "Profile",
    user: JSON.stringify(obj),
    name: req.user.name,
    image: req.user.image,
    url: JSON.stringify(CURRENT_URL),
    layout: "home_profile",
  });
};

module.exports.request = (req, res) => {
  var obj = JSON.parse(req.params.obj)[0];

  var studentEmail = obj.studentEmail;
  var adminName = obj.adminName;
  
  var hostelTaken = obj.hostelTaken;

  var updateObject = {};
  updateObject[adminName + "Applied"] = true;
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  updateObject[adminName + "AppliedAt"] = dateTime;
  updateObject["hostelTaken"] = hostelTaken;
  User.findOneAndUpdate(
    { email: obj["studentEmail"] },
    updateObject,
    (err, user) => {
      if (err) {
        console.log("Error in updating request status: ", err);
        return;
      }
      user.save();
    }
  );
  return res.redirect("/");
};

module.exports.sendBtpRequest = (req, res) => {
  var obj = JSON.parse(req.params.obj);
  User.findOne({ email: obj[0]["studentEmail"] }, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendBtpRequest: ", err);
      return;
    }
    var id = user._id;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    var updatedObject = {};
    updatedObject["btpApplied"] = true;
    updatedObject["btpAppliedAt"] = dateTime;
    updatedObject["profEmail"] = obj[0]["profEmail"];
    updatedObject["projectName"] = obj[0]["projectName"];
    updatedObject["projectDescription"] = obj[0]["projectDescription"];
    user.btpList.push(updatedObject);
    user.save();
    sendBtpRequest_mailer.sendBtpRequest(
      obj[0]["profEmail"],
      obj[0]["studentEmail"],
      obj[0]["projectName"],
      obj[0]["projectDescription"],
      user.btpList.length - 1
    );
  });
  return res.redirect("/");
};

module.exports.sendIpRequest = (req, res) => {
  var obj = JSON.parse(req.params.obj); 

  User.findOne({ email: obj[0]["studentEmail"] }, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendBtpRequest: ", err);
      return;
    }
    var id = user._id;
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    var updatedObject = {};
    updatedObject["ipApplied"] = true;
    updatedObject["ipAppliedAt"] = dateTime;
    updatedObject["profEmail"] = obj[0]["profEmail"];
    updatedObject["projectName"] = obj[0]["projectName"];
    updatedObject["projectDescription"] = obj[0]["projectDescription"];
    user.ipList.push(updatedObject);
    user.save();
    sendIpRequest_mailer.sendIpRequest(
      obj[0]["profEmail"],
      obj[0]["studentEmail"],
      obj[0]["projectName"],
      obj[0]["projectDescription"],
      user.ipList.length - 1
    );
  });
  
  return res.redirect("/");
};

function modifyAdminName(s) {
  if (s.substring(0, 9) == "Academics") {
    return "academics";
  }
  var arr = s.split(" ");
  var newName = arr[0].toLowerCase();
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] == "&" || arr[i] == "&amp;") {
      arr[i] = "and";
    }
    newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1);
  }
  return newName;
}

module.exports.download = async (req, res) => {
  
  var id = req.params.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      console.log("Error in finding user in download: ", err);
      return;
    }

    return res.render("pdf", {
      user: JSON.stringify(user),
      url: JSON.stringify(CURRENT_URL),
      layout: "pdf",
    });
  });
};

module.exports.sendBankDetails = (req, res) => {
  var obj = JSON.parse(req.params.bankDetails);
  var updateObject = {};
  updateObject.bankName = obj.bankName;
  updateObject.bankBranch = obj.bankBranch;
  updateObject.bankAccountNo = obj.bankAccountNo;
  updateObject.bankIfscCode = obj.bankIfscCode;
  updateObject.bankAccountHolder = obj.bankAccountHolder;
  User.findOneAndUpdate({ email: obj["email"] }, updateObject, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendBankDetails: ", err);
      return;
    }
    user.save();
   
  });
  res.status = 200;
  return res.end();
};

module.exports.sendDonationDetails = (req, res) => {
  var obj = JSON.parse(req.params.donationDetails);
  var updateObject = {};
  updateObject.donationAdmin = obj.donationAdmin;
  updateObject.donationAmount = obj.donationAmount;

  console.log(obj);
 
  User.findOneAndUpdate({ email: obj["email"] }, updateObject, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendDonationDetails: ", err);
      return;
    }
    user.save();
  });

  res.status = 200;
  return res.end();
};

module.exports.sendPersonalDetails = (req, res) => {
  var obj = JSON.parse(req.params.personalDetails);
  var updateObject = {};
  updateObject.mobile = obj.personalMobile;
  updateObject.other_email = obj.personalEmail;
  updateObject.date_of_leaving = obj.leavingDate;
  updateObject.reason_of_leaving = obj.leavingReason;
  User.findOneAndUpdate({ email: obj["email"] }, updateObject, (err, user) => {
    if (err) {
      console.log("Error in finding student in sendPersonalDetails: ", err);
      return;
    }
    user.save();    
  });

  res.status = 200;
  return res.end();

};

module.exports.getFunction = (req, res) => {
  return res.status(200).json(getAdminName.adminNames);
};

//Unknown Operations

module.exports.sheet = (req, res) => {
  return res.redirect(
    "https://docs.google.com/spreadsheets/d/1zRLMi10k1zxMyv2uygSUhcxSEJsova76t8fBXi3GiSk/edit?usp=sharing"
  );
};

module.exports.bankAccountDetails = (req, res) => {
  return res.redirect(
    "https://docs.google.com/spreadsheets/d/1Fn5EplhqwEB5c0chYqhhWCal5Kzs7hT4zNFCwkAkZpE/edit?usp=sharing"
  );
};

module.exports.studentList = (req, res) => {
  return res.render("student_list", {
    title: "No-Dues List",
    layout: "student_list",
  });
};
