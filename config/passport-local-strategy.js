const passport = require("passport");
const { google } = require("googleapis");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../models/admin");
const getProffName = require("../data/getProffName");

const User = require("../models/user");
const { EMAIL_ID, SUPER_ADMIN_EMAIL } = require("../config/config");

function add(temp, x) {
  if (x != true) {
    temp.array.push("No");
  } else {
    temp.array.push("Yes");
  }
}
function add2(temp, x) {
  if (x == null) {
    temp.array.push("null");
  } else {
    temp.array.push(x);
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          console.log("Error in finding user in passport");
          return done(err);
        }
        if (!user || user.password != password) {
          console.log("Invalid username/password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

//serialize the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log("Error in finding user in passport");
      return done(err);
    }
    return done(null, user);
  });
});

//check if the incoming user is authenticated
passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/user/signin");
};

//check if it's admin
passport.checkAdminAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.email == `${SUPER_ADMIN_EMAIL}` ||
      Admin.checkAdmin(req.user.email)
    ) {
      return next();
    } else if (getProffName.isProff(req.user.email)) {
      // return res.redirect('/proff_home');
    } else {
      return res.redirect("/");
    }
  }

  req.flash("error", "Invalid Access");
  return res.redirect("/user/signin");
};

//check if it's a normal User
passport.checkUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.email == `${SUPER_ADMIN_EMAIL}`) {
      return res.redirect("/super_admin");
    } else if (Admin.checkAdmin(req.user.email)) {
      return res.redirect("/admin_home");
    } else if (getProffName.isProff(req.user.email)) {
      return res.redirect("/proff_home");
    } else {
      return next();
    }
  }

  req.flash("error", "Invalid Access");
  return res.redirect("/user/signin");
};

//check if it's Proffesor
passport.checkProffAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (Admin.checkAdmin(req.user.email)) {
      return res.redirect("/admin_home");
    } else if (
      req.user.email == `${SUPER_ADMIN_EMAIL}` ||
      getProffName.isProff(req.user.email)
    ) {
      return next();
    } else {
      return res.redirect("/");
    }
  }
  req.flash("error", "Invalid Access");
  return res.redirect("/user/signin");
};

//check if superAdmin
passport.checkSuperAdminAuthentication = async (req, res, next) => {
  if (req.isAuthenticated() && req.user.email == `${SUPER_ADMIN_EMAIL}`) {
    return next();
  }
  req.flash("error", "Invalid Access");
  return res.redirect("/user/signin");
};

passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

function adminsLeft(student) {
  var admins_list = Admin.admins;

  var check = true;

  for (var i in admins_list) {
    if (!student[admins_list[i]]) {
      check = false;
    } else {
      check &= student[admins_list[i]];
    }
  }

  for (var j in student["ipList"]) {
    if (!(student["ipList"][j] == true)) {
      check = false;
      break;
    }
  }

  for (var j in student["btpList"]) {
    if (!(student["btpList"][j] == true)) {
      check = false;
      break;
    }
  }

  return Boolean(check);
}

passport.checkSheetAuthentication = async (req, res, next) => {
  const spreadsheetId = "1zRLMi10k1zxMyv2uygSUhcxSEJsova76t8fBXi3GiSk";
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });

  await googleSheets.spreadsheets.values.clear({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
  });
  values = [];
  values.push([
    "Name",
    "Roll no.",
    "Email",
    "Mobile No.",
    "Degree",
    "Department",
    "Batch",
    "Leaving Reason",
    "Design Lab",
    "Library",
    "Admin Facilities",
    "System Admin",
    "Sports",
    "Hostel",
    "ECE Labs",
    "Placement",
    "Incubation",
    "Finance",
    "Academics",
    "IP",
    "BTP",
    "Total",
    "NoDues",
    "Bank Name",
    "Branch Name",
    "Account Holder Name",
    "Account No",
    "IFSC Code"
  ]);
  var docs = await User.find({});
  for (var i in docs) {
    if (!docs[i]["type"]) {
      var temp = { array: [] };
      add2(temp, docs[i]["name"]);
      add2(temp, docs[i]["roll"]);
      add2(temp, docs[i]["email"]);
      add2(temp, docs[i]["mobile"]);
      add2(temp, docs[i]["degree"]);
      add2(temp, docs[i]["department"]);
      add2(temp, docs[i]["batch"]);
      add2(temp, docs[i]["personalDetails"]);
      add(temp, docs[i]["designLab"]);
      add(temp, docs[i]["library"]);
      add(temp, docs[i]["adminFacilities"]);
      add(temp, docs[i]["systemAdminAndNetworking"]);
      add(temp, docs[i]["sportsAndStudentFacilities"]);
      add(temp, docs[i]["hostel"]);
      add(temp, docs[i]["eceLabs"]);
      add(temp, docs[i]["placementIncharge"]);
      add(temp, docs[i]["incubationCenter"]);
      add(temp, docs[i]["finance"]);
      add(temp, docs[i]["academics"]);
      var checkIp = true;
      for (var j in docs[i]["ipList"]) {
        if (!(docs[i]["ipList"][j] == true)) {
          checkIp = false;
          break;
        }
      }
      add(temp, checkIp);
      var checkBtp = true;
      for (var j in docs[i]["btpList"]) {
        if (!(docs[i]["btpList"][j] == true)) {
          checkBtp = false;
          break;
        }
      }
      add(temp, checkBtp);
      add(temp, adminsLeft(docs[i]));
      add(temp, docs[i]["nodues"]);
      add2(temp, docs[i]["bankName"]);
      add2(temp, docs[i]["bankBranch"]);
      add2(temp, docs[i]["bankAccountHolder"]);
      add2(temp, docs[i]["bankAccountNo"]);
      add2(temp, docs[i]["bankIfscCode"]);

      values.push(temp.array);
    }
  }
  await googleSheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values,
    },
  });
  next();
};

passport.checkBankAuthentication = async (req, res, next) => {
  //Account Details
  const spreadsheetId = "1Fn5EplhqwEB5c0chYqhhWCal5Kzs7hT4zNFCwkAkZpE";
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const metadata = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });

  await googleSheets.spreadsheets.values.clear({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
  });
  values = [];
  values.push([
    "Name",
    "Roll no.",
    "Email",
    "Bank Name",
    "Branch Name",
    "Account Holder Name",
    "Account No",
    "IFSC Code",
  ]);
  var docs = await User.find({});
  for (var i in docs) {
    if (!docs[i]["type"]) {
      var temp = { array: [] };
      add(temp, docs[i]["name"]);
      add(temp, docs[i]["roll"]);
      add(temp, docs[i]["email"]);
      add(temp, docs[i]["bankName"]);
      add(temp, docs[i]["bankBranch"]);
      add(temp, docs[i]["bankAccountHolder"]);
      add(temp, docs[i]["bankAccountNo"]);
      add(temp, docs[i]["bankIfscCode"]);
      values.push(temp.array);
    }
  }
  await googleSheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values,
    },
  });
  next();
};

module.exports = passport;
