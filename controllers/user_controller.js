const User = require("../models/user");
const getProffName = require("../data/getProffName");
const Admin = require("../models/admin");
const professorsList = require("../data/professors.json");
const studentsList = require("../data/students.json");
const adminsList = require("../data/admins.json");
const { CURRENT_URL, NODEMAILER_EMAIL_ID } = require("../config/config");

module.exports.signup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }
  return res.render("signup", {
    title: "Sign Up",
    layout: "signup",
  });
};

module.exports.signin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("signin", {
    title: "Sign In",
    layout: "signin",
  });
};

module.exports.create = (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("Error in finding user in sign up");
      return;
    }
    if (!user) {
      if (Admin.checkAdmin(req.body.email)) {
        User.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: "Admin",
            department: Admin.findAdmin(req.body.email),
          },
          (err, user) => {
            if (err) {
              console.log("Error in creating user in sign up");
              return;
            }
            return res.redirect("/user/signin");
          }
        );
      } else {
        User.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
          (err, user) => {
            if (err) {
              console.log("Error in creating user in sign up");
              return;
            }
            return res.redirect("/user/signin");
          }
        );
      }
    } else {
      return res.redirect("back");
    }
  });
};

module.exports.createSession = (req, res) => {
  req.flash("success", "Logged in successfully");
  if (Admin.checkAdmin(req.user.email)) {
    return res.redirect("/admin_home");
  } else if (req.user.email == `${NODEMAILER_EMAIL_ID}`) {
    return res.redirect("/super_admin");
  } else if (getProffName.isProff(req.user.email)) {
    return res.redirect("/proff_home");
  }
  return res.redirect("/");
};

module.exports.failedSignIn = (req, res) => {
  req.flash("error", "Invalid Credentials");
  return res.redirect("/user/signin");
};

module.exports.destroySession = (req, res) => {
  req.flash("success", "Logged out successfully");
  req.logout();
  return res.redirect("/user/signin");
};

module.exports.getProfessors = (req, res) => {
  return res.status(200).json(professorsList);
};

module.exports.getProfessorName = (req, res) => {
  let email = req.params.profEmail;

  let result = getProffName.getProffName(email);

  return res.status(200).json(result);
};

module.exports.getUser = async (req, res) => {
  var id = req.params.id;
  await User.findById(id, (err, user) => {
    if (err) {
      console.log("Error in finding user in getuser ", err);
      return;
    }
    return res.status(200).json(user);
  });
};

function checkSuperAdmin(student, curr_status,superAdminName) {
  if (curr_status == "pending") {
    return student[superAdminName] == null;
  } else if (curr_status == "accepted") {
    return student[superAdminName] == true;
  } else {
    return student[superAdminName] == false;
  }
}

module.exports.getStudents = (req, res) => {
  let studentList = [];
  let status=req.params.status;
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in loading all the users");
      return;
    }

    for (var i in users) {
      
      if (users[i]["type"] == undefined && checkSuperAdmin(users[i],status,'nodues')) {
        studentList.push(users[i]);
      }
    }

    return res.status(200).json(studentList);
  });
};

function check(student, curr_status,adminName) {
  
  if (curr_status == "pending") {
    return student[adminName + "Applied"] && student[adminName] == null;
  } else if (curr_status == "accepted") {
    return student[adminName] == true;
  } else {
    return student[adminName] == false;
  }
}

module.exports.getStudentsAdmin = (req, res) => {
  let studentList = [];
  let adminName = req.params.adminName;
  let status=req.params.status;
  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in loading all the users");
      return;
    }
    

    for (var i in users) {
      
      if (
        users[i]["type"] == undefined &&
        users[i][`${adminName}Applied`] == true)
      {
        if(check(users[i],status,adminName)){
          studentList.push(users[i]);
        }
      }
    }

    return res.status(200).json(studentList);
  });
};

module.exports.getStudentsProfessor = (req, res) => {
  let studentList = [];
  let profEmail = req.params.profEmail;
  let status=req.params.status;


  User.find({}, (err, users) => {
    if (err) {
      console.log("Error in loading all the users");
      return;
    }

    for (var i in users) {
      if (users[i]["type"] == undefined) {
        let check = true;
        for (var j in users[i]["ipList"]) {
          if (users[i]["ipList"][j]["profEmail"] == profEmail) {

            var obj=users[i]['ipList'][j];
           

            if (status == "pending" && obj['ip'] == undefined) {
              studentList.push(users[i]);
              check = false;
              break;
            } else if (status == "accepted" && obj['ip'] == true) {
              studentList.push(users[i]);
              check = false;
              break;
            } else if (status == "rejected" && obj['ip'] == false) {
              studentList.push(users[i]);
              check = false;
              break;
            }
            
          }
        }
        if (check) {
          for (var j in users[i]["btpList"]) {
            if (users[i]["btpList"][j]["profEmail"] == profEmail) {

              var obj=users[i]['btpList'][j];

              if (status == "pending" && obj['btp'] == undefined) {
                studentList.push(users[i]);
                check = false;
                break;
              } else if (status == "accepted" && obj['btp'] == true) {
                studentList.push(users[i]);
                check = false;
                break;
              } else if (status == "rejected" && obj['btp'] == false) {
                studentList.push(users[i]);
                check = false;
                break;
              }
              
            }
          }
        }
      }
    }

    return res.status(200).json(studentList);
  });
};

module.exports.getAdmins = (req, res) => {
 
  return res.status(200).json(Admin.admins);
};

module.exports.getAdminDetails = (req, res) => {
  Admin.db.find({ admin: req.params.admin }, function (err, adminObj) {
    if (err) {
      console.log("Can't find admin");
    }
    return res.status(200).json(adminObj);
  });
};

module.exports.getStudentsLoggedIn = async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      console.log("Error in finding all users in getStudentsLoggedIn: ", err);
      return;
    }
    return res.status(200).json(users);
  });
};
