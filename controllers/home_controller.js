const User = require("../models/user");
const Admin = require("../models/admin");
const { google, factchecktools_v1alpha1 } = require("googleapis");
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
const { CURRENT_URL, NODEMAILER_EMAIL_ID, STUDENT_EXCEL_URL, ADMIN_EXCEL_URL, PROFESSOR_EXCEL_URL, ADMIN_EXCEL_ID, STUDENT_EXCEL_ID, PROFESSOR_EXCEL_ID, BANK_EXCEL_URL, MAIN_EXCEL_URL } = require("../config/config");
const fs = require("fs");
const { update } = require("../models/user");
const { ConsoleMessage } = require("puppeteer");


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
  try{
    var obj = JSON.parse(req.params.dues);

    User.findOne({ email: obj[0].email }, async (err, user) => {
      if (err) {
        console.log(err);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
      
      try{
        var id = user._id;
        var attribute = obj[0].admin + "Message";
        
        user[obj[0].admin] = false;
        user[attribute] = obj[0].message;
        user[obj[0].admin + "ApprovedAt"] = null;

        await user.save();
        super_message_mailer.newMessage(obj[0].message, obj[0].email);
        res.status = 200;
        return res.end();
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();

      }
    });
  }
  catch (err){
    console.log(err);
    req.flash("error","Something Went Wrong. Please Try Again or Later!");
    res.status=500;
    return res.end();
  }
  
};

module.exports.superApproveDues = (req, res) => {
  try {
    var obj = JSON.parse(req.params.dues);
    User.findOne({ email: obj[0].email }, async (err, user) => {
      if (err) {
        console.log(err);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
        
      }

      try{
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
        user[obj[0].admin] = true;
        user[obj[0].admin + "ApprovedAt"] = dateTime;

        await user.save();
        super_approved_mailer.approvedDues(obj[0].email);
        res.status = 200;
        return res.end();
      }catch (e) {
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
  
};

module.exports.superApproveManyDues = (req, res) => {
  try{
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
        async (err, user) => {
          if (err ||!user) {
            console.log("Error in Approving many Dues by SuperAdmin");          
          }
          else{
            await user.save();
            super_approved_mailer.approvedDues(studentEmail);
          }
          
        }
      );
    }
    res.status = 200;
    return res.end();
  }
  catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
};

module.exports.updateAccess = (req, res) => {
  
  return res.render("updateAccess", {
    title: "Update Access",
    adminName: "nodues",
    studentURL: JSON.stringify(
      STUDENT_EXCEL_URL
    ),
    adminURL: JSON.stringify(
      ADMIN_EXCEL_URL
    ),
    professorURL: JSON.stringify(
      PROFESSOR_EXCEL_URL
    ),
    id: req.user._id,
    url: JSON.stringify(CURRENT_URL),
    layout: "updateAccess",
  });

};

module.exports.updateAdmin=async (req,res)=>{
  try {
    var admins_data;
    var spreadsheetId = ADMIN_EXCEL_ID;
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
    admins_data = data.data.values;

    fs.readFile(`data/admins.json`, (err, data) => {
      if (err) {
        console.log("Error in reading admins file: ", err);
        return;
      }

      if (data != JSON.stringify(admins_data)) {
        fs.writeFile(`data/admins.json`, JSON.stringify(admins_data), (err) => {
          if (err) {
            console.log("Error in writing to admins file: ", err);
            return;
          }
        });
      }
    });
    Admin.db.collection.drop();
    Admin.addAdmins(admins_data);
    res.status = 200;
    return res.end();
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
}

module.exports.updateStudent = async (req, res) => {
  try {
    var spreadsheetId = STUDENT_EXCEL_ID;
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
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
  
};

module.exports.updateProfessor = async (req, res) => {
  try {
    var spreadsheetId = PROFESSOR_EXCEL_ID;
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
      if (i == 0) {
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
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
  
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
    if (err || !users) {
      console.log("Error in loading all the users");
      return;
    }
    for (var i in users) {
      if (users[i] && !users[i]["type"]) {
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
  try {
    var obj = JSON.parse(req.params.dues);
    User.findOne({ email: obj[0].email }, async (err, user) => {
      if (err) {
        console.log("Error in finding student from email id");
        return;
      }
      try{
        var id = user._id;

        var msg = obj[0].admin + "Message";
        var fine = obj[0].admin + "Fine";

        user[obj[0].admin] = false;
        user[msg] = obj[0].message;
        user["totalFine"] =
          Number(user.totalFine) - Number(user[fine]) + Number(obj[0].fine);
        user[fine] = Number(obj[0].fine);
        user[obj[0].admin + "ApprovedAt"] = null;
        await user.save();

        if (obj[0].admin == "academics") {
          obj[0].admin += user.degree[0];
        }

        if (user[fine] != 0) {
          obj[0].message += `<br> Fine: Rs. ${user[fine]}`;
        }

        message_mailer.newMessage(obj[0].message, obj[0].email, obj[0].admin);

        res.status = 200;
        return res.end();
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
};

module.exports.approveDues = (req, res) => {
  try {
    var obj = JSON.parse(req.params.dues);

    User.findOne({ email: obj[0].email }, async (err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      try {
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
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        var dateTime = date + " " + time;
        user[obj[0].admin] = true;
        user[obj[0].admin + "ApprovedAt"] = dateTime;
        user["totalFine"] =
          Number(user["totalFine"]) - Number(user[obj[0].admin + "Fine"]);
        user[obj[0].admin + "Fine"] = 0;

        await user.save();

        if (obj[0].admin == "academics") {
          obj[0].admin += user.degree[0];
        }
        approved_mailer.approvedDues(obj[0].admin, obj[0].email);
        res.status = 200;
        return res.end();
      } catch (e) {
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
 
};

module.exports.approveManyDues = (req, res) => {
  try {
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
        async (err, user) => {
          if (err) {
            console.log("Error in Approving many Dues by Admin");
            console.log(err);
          }
          try{
            user["totalFine"] =
              Number(user["totalFine"]) - Number(user[adminName + "Fine"]);
            user[adminName + "Fine"] = 0;
            await user.save();
            if (adminName == "academics") {
              approved_mailer.approvedDues(
                adminName + user.degree[0],
                studentEmail
              );
            } else {
              approved_mailer.approvedDues(adminName, studentEmail);
            }
          }
          catch(e){
            console.log(e);
          }
        }

      );
    }
    res.status = 200;
    return res.end();
  } 
  catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  

  
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
  try {
    var obj = JSON.parse(req.params.dues)[0];
    var studentEmail = obj.studentEmail;
    var adminName = obj.admin;
    var projectName = obj.projectName;
    var profEmail = obj.profEmail;

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

    User.findOne({ email: studentEmail }, async (err, user) => {
      if (err) {
        console.log("Error in saving profEmail in approveManyProff: ", err);
        return;
      }
      try{
        for (var idx in user[`${adminName}List`]) {
          var ipObj = user[`${adminName}List`][idx];

          if (
            ipObj[`projectName`] == projectName &&
            ipObj[`profEmail`] == profEmail
          ) {
            user[`${adminName}List`][idx][adminName] = true;
            user[`${adminName}List`][idx][adminName + "ApprovedAt"] = dateTime;
            await user.save();

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
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
  
};

module.exports.proffHome = (req, res) => { 

  return res.render("proff_home", {
    title: "Proff - Home",
    name: req.user.name,
    profEmail: req.user.email,
    image: req.user.image,
    url: JSON.stringify(CURRENT_URL),
    layout: "proff_home",
  });  
};

module.exports.sendMessageBtp = (req, res) => {
  try {
    var obj = JSON.parse(req.params.dues);
    var studentEmail = obj[0]["email"];
    var profEmail = obj[0]["profEmail"];
    var message = obj[0]["message"];
    var idx = obj[0]["idx"];

    User.findOne({ email: studentEmail }, async (err, user) => {
      if (err) {
        console.log("Error in finding student in sendMessageBtp: ", err);
        return;
      }
      try{
        user["btpList"][idx]["btp"] = false;
        user["btpList"][idx]["btpMessage"] = message;

        await user.save();
        sendBtpMessage_mailer.sendBtpMessage_mailer(
          message,
          studentEmail,
          profEmail,
          idx
        );
        res.status = 200;
        return res.end();
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
};

module.exports.sendMessageIp = (req, res) => {
  try {
    var obj = JSON.parse(req.params.dues);
    var studentEmail = obj[0]["email"];
    var profEmail = obj[0]["profEmail"];
    var message = obj[0]["message"];
    var idx = obj[0]["idx"];

    User.findOne({ email: studentEmail }, async (err, user) => {
      if (err) {
        console.log("Error in finding student in sendMessageIp: ", err);
        return;
      }
      try{
        user["ipList"][idx]["ip"] = false;
        user["ipList"][idx]["ipMessage"] = message;

        await user.save();
        sendIpMessage_mailer.sendIpMessage_mailer(
          message,
          studentEmail,
          profEmail,
          idx
        );
        res.status = 200;
        return res.end();
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();        
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
  
  
};

module.exports.btpApproved = (req, res) => {
  try {
    var obj = JSON.parse(req.params.dues)[0];
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
    var idx = obj["idx"];
    var studentEmail = obj["email"];

    User.findOne({ email: studentEmail }, async (err, user) => {
      if (err) {
        console.log("Error in finding student in btpApproved: ", err);
        return;
      }
      try{
        user["btpList"][idx]["btp"] = true;
        user["btpList"][idx]["btpApprovedAt"] = dateTime;
        user["btpList"][idx]["profEmail"] = obj["profEmail"];

        await user.save();
        btpApproved_mailer.btpApproved_mailer(
          obj["profEmail"],
          obj["email"],
          idx
        );
        res.status = 200;
        return res.end();
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
};

module.exports.ipApproved = (req, res) => {
  try {
    var obj = JSON.parse(req.params.dues)[0];
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
    var idx = obj["idx"];
    var studentEmail = obj["email"];

    User.findOne({ email: studentEmail }, async (err, user) => {
      if (err) {
        console.log("Error in finding student in ipApproved: ", err);
        return;
      }
      try{
        user["ipList"][idx]["ip"] = true;
        user["ipList"][idx]["ipApprovedAt"] = dateTime;
        user["ipList"][idx]["profEmail"] = obj["profEmail"];

        await user.save();
        ipApproved_mailer.ipApproved_mailer(obj["profEmail"], obj["email"], idx);
        res.status = 200;
        return res.end();
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        res.status = 500;
        return res.end();        
      }
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }

  
};

module.exports.afterMailPage = (req, res) => {
  var status = req.params.status;
  if(!status){
    res.redirect("/");
  }

  res.render("afterMailPage", { title: "No Dues",status: status, layout: "afterMailPage" });
};

module.exports.ipApprovedThroughMail = (req, res) => {
  try {
    var studentId = req.params.studentId;
    var profEmail = req.params.profEmail;
    var idx = req.params.idx;

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

    User.findById(studentId, async (err, user) => {
      if (err) {
        console.log("Error finding user in ipApprovedThroughMail: ", err);
        return res.redirect("/proff_home");
      }
      try{
        var ipObj = user["ipList"][idx];

        if (ipObj["ip"] != undefined) {
          return res.redirect("/ip/btp/error");
        }
        user["ipList"][idx]["ip"] = true;
        user["ipList"][idx]["ipApprovedAt"] = dateTime;
        user["ipList"][idx]["profEmail"] = profEmail;

        await user.save();
        ipApproved_mailer.ipApproved_mailer(profEmail, user.email, idx);
        return res.redirect("/ip/btp/success");
      }
      catch(e){
        console.log(e);
        return res.redirect("/ip/btp/error");
      }
    });
  } catch (err) {
    console.log(err);    
    return res.redirect("/ip/btp/error");
  }
  
};

module.exports.btpApprovedThroughMail = (req, res) => {
  try {
    var studentId = req.params.studentId;
    var profEmail = req.params.profEmail;
    var idx = req.params.idx;

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

    User.findById(studentId, async (err, user) => {
      if (err) {
        console.log("Error finding user in btpApprovedThroughMail: ", err);
        return res.redirect("/proff_home");
      }
      try{
        var btpObj = user["btpList"][idx];

        if (btpObj["btp"] != undefined) {
          return res.redirect("/ip/btp/error");
        }
        user["btpList"][idx]["btp"] = true;
        user["btpList"][idx]["btpApprovedAt"] = dateTime;
        user["btpList"][idx]["profEmail"] = profEmail;

        await user.save();
        btpApproved_mailer.btpApproved_mailer(profEmail, user.email, idx);
        return res.redirect("/ip/btp/success");
      }
      catch(e){
        console.log(e);
        return res.redirect("/ip/btp/error");
      }
    });
  } catch (err) {
    console.log(err);
    
    return res.redirect("/ip/btp/error");
  }
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

module.exports.request = async(req, res) => {
  try {
    var obj = JSON.parse(req.params.obj)[0];

    var studentEmail = obj.studentEmail;
    var adminName = obj.adminName;

    var hostelTaken = obj.hostelTaken;

    var updateObject = {};
    updateObject[adminName + "Applied"] = true;
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
    updateObject[adminName + "AppliedAt"] = dateTime;
    updateObject["hostelTaken"] = hostelTaken;
    await User.findOneAndUpdate(
      { email: obj["studentEmail"] },
      updateObject,
      (err, user) => {
        if (err) {
          console.log("Error in updating request status: ", err);
          return res.redirect("/");
        }
        if(!user){
          console.log("User not defined");
          return res.redirect("/");
        }
        user.save();
      }
    );
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    return res.redirect("/");
  }
  
};

module.exports.sendBtpRequest = async (req, res) => {
  try {
    var obj = JSON.parse(req.params.obj);
    await User.findOne({ email: obj[0]["studentEmail"] }, async (err, user) => {
      if (err) {
        console.log("Error in finding student in sendBtpRequest: ", err);
        return res.redirect("/");
      }
      try{
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
        await user.save();
        sendBtpRequest_mailer.sendBtpRequest(
          obj[0]["profEmail"],
          obj[0]["studentEmail"],
          obj[0]["projectName"],
          obj[0]["projectDescription"],
          user.btpList.length - 1
        );
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        return res.redirect("/");
      }
    });

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    return res.redirect("/");
  }
};

module.exports.sendIpRequest = async(req, res) => {
  try {
    var obj = JSON.parse(req.params.obj);

    await User.findOne({ email: obj[0]["studentEmail"] }, async (err, user) => {
      if (err ) {
        console.log("Error in finding student in sendIpRequest: ", err);
        return res.redirect("/");
      }
      
      try{
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
        await user.save();
        sendIpRequest_mailer.sendIpRequest(
          obj[0]["profEmail"],
          obj[0]["studentEmail"],
          obj[0]["projectName"],
          obj[0]["projectDescription"],
          user.ipList.length - 1
        );
      }
      catch(e){
        console.log(e);
        req.flash("error", "Something Went Wrong. Please Try Again or Later!");
        return res.redirect("/");
      }
    });
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    return res.redirect("/");
  }
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
  try {
    var id = req.params.id;
    User.findOne({ _id: id }, (err, user) => {
      if (err) {
        console.log("Error in finding user in download: ", err);
        return res.redirect("/");
      }
      if(!user){
        console.log("User is not defined");
        return res.redirect("/");
      }

      return res.render("pdf", {
        user: JSON.stringify(user),
        url: JSON.stringify(CURRENT_URL),
        layout: "pdf",
      });
    });
  } catch (err) {
    console.log(err);
    // req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    return res.redirect("/");
  }
  
  
  
};

module.exports.sendBankDetails = (req, res) => {
  try {
    const obj = req.body;
    var updateObject = {};
    updateObject.bankName = obj.bankName;
    updateObject.bankBranch = obj.bankBranch;
    updateObject.bankAccountNo = obj.bankAccountNo;
    updateObject.bankIfscCode = obj.bankIfscCode;
    updateObject.bankAccountHolder = obj.bankAccountHolder;
    updateObject.cancelledCheque = obj.cancelledCheque;
    User.findOneAndUpdate(
      { email: obj["email"] },
      updateObject,
      (err, user) => {
        if (err) {
          console.log("Error in finding student in sendBankDetails: ", err);
          return;
        }
        if(!user){
          console.log("user not defined");
          return;
        }
        user.save();
      }
    );
    res.status = 200;
    return res.end();
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
    
};

module.exports.sendDonationDetails = async (req, res) => {
  try {
    var obj = req.body;
    var updateObject = {};
    updateObject.donationAdmin = obj.donationAdmin;
    updateObject.donationAmount = obj.donationAmount;

    await User.findOneAndUpdate(
      { email: obj["email"] },
      updateObject,
      (err, user) => {
        if (err ) {
          console.log("Error in finding student in sendDonationDetails: ", err);
          return;
        }
        if (!user) {
          console.log("user not defined");
          return;
        }
        user.save();
      }
    );

    res.status = 200;
    return res.end();
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }
};

module.exports.sendPersonalDetails = async (req, res) => {
  try {
    var obj = req.body;
    var updateObject = {};
    updateObject.mobile = obj.personalMobile;
    updateObject.other_email = obj.personalEmail;
    updateObject.date_of_leaving = obj.leavingDate;
    updateObject.reason_of_leaving = obj.leavingReason;
    await User.findOneAndUpdate(
      { email: obj["email"] },
      updateObject,
      (err, user) => {
        if (err) {
          console.log("Error in finding student in sendPersonalDetails: ", err);
          return;
        }
        if (!user) {
          console.log("user not defined");
          return;
        }
        user.save();
      }
    );

    res.status = 200;
    return res.end();
  } catch (err) {
    console.log(err);
    req.flash("error", "Something Went Wrong. Please Try Again or Later!");
    res.status = 500;
    return res.end();
  }

};

module.exports.getFunction = (req, res) => {
  return res.status(200).json(getAdminName.adminNames);
};

//Unknown Operations

module.exports.sheet = (req, res) => {
  return res.redirect(
    MAIN_EXCEL_URL
  );
};

module.exports.bankAccountDetails = (req, res) => {
  return res.redirect(
    BANK_EXCEL_URL
  );
};

module.exports.studentList = (req, res) => {
  return res.render("student_list", {
    title: "No-Dues List",
    layout: "student_list",
  });
};
