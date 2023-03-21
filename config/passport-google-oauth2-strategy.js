const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const getProffName = require("../data/getProffName");
const Admin = require("../models/admin");
const fs = require("fs");
const { google } = require("googleapis");
const students_data = require("../data/students.json");
const {
  CURRENT_URL,
  GOOGLE_SIGNIN_CLIENT_ID,
  GOOGLE_SIGNIN_SECRET_ID,
  SUPER_ADMIN_EMAIL,
} = require("../config/config");

function getGender(email, students) {
  for (var i in students) {
    if (students[i][5] == email) {
      var gender = students[i][4];
      var department = students[i][3];
      var degree = students[i][0];
      var roll = students[i][1];
      var name = students[i][2];
      if (
        gender == "m" ||
        gender == "M" ||
        gender == "male" ||
        gender == "Male"
      ) {
        gender = "male";
      } else if (
        gender == "f" ||
        gender == "F" ||
        gender == "female" ||
        gender == "Female"
      ) {
        gender = "female";
      } else {
        gender = "others";
      }
      if (
        department == "Computer Science and Applied Mathematics" ||
        department == "Computer Science & Applied Mathematics" ||
        department == "CSAM"
      ) {
        department = "Mathematics";
      }
      if (
        department == "Computer Science and Engineering" ||
        department == "Computer Science & Engineering" ||
        department == "CSE"
      ) {
        department = "CSE";
      }
      if (
        department == "Computer Science and Design" ||
        department == "Computer Science & Design" ||
        department == "CSD"
      ) {
        department = "HCD";
      }
      if (
        department == "Electronics and Communication Engineering" ||
        department == "Electronics & Communication Engineering" ||
        department == "ECE"
      ) {
        department = "ECE";
      }
      if (
        department == "Computer Science and Biosciences" ||
        department == "Computer Science and Biosciences" ||
        department == "CSB"
      ) {
        department = "CB";
      }
      if (
        department == "Computer Science and Artificial Intelligence" ||
        department == "Computer Science and Artificial Intelligence" ||
        department == "CSAI"
      ) {
        department = "CSE";
      }
      if (
        department == "Computer Science and Social Sciences" ||
        department == "Computer Science and Social Sciences" ||
        department == "CSSS"
      ) {
        department = "SSH";
      }
      if (degree == "B.Tech" || degree == "B.Tech.") {
        degree = "B. Tech";
      }
      if (degree == "M.Tech" || degree == "M.Tech.") {
        degree = "M. Tech";
      }
      if (degree == "PhD") {
        degree = "PhD";
      }
      return [gender, department, degree, roll, name];
    }
  }
  return null;
}

passport.use(
  new googleStrategy(
    {
      clientID: `${GOOGLE_SIGNIN_CLIENT_ID}`,
      clientSecret: `${GOOGLE_SIGNIN_SECRET_ID}`,
      callbackURL: `${CURRENT_URL}/user/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      if (profile.emails[0].value == SUPER_ADMIN_EMAIL) {
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
          if (err) {
            console.log("Error in google strategy passport", err);
            return;
          }
          if (user) {
            return done(null, user);
          } else {
            User.create(
              {
                name: profile.name["givenName"],
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
                image: profile.photos[0].value,
                type: "Super Admin",
              },
              (err, user) => {
                if (err) {
                  console.log(
                    "Error in creating user google strategy-passport",
                    err
                  );
                  return;
                }
                return done(null, user);
              }
            );
          }
        });
      } else if (Admin.checkAdmin(profile.emails[0].value)) {
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
          if (err) {
            console.log("Error in google strategy passport", err);
            return;
          }
          if (user) {
            user["type"] = "Admin";
            user['name']= profile.name["givenName"];
            user.save();
            return done(null, user);
          } else {
            User.create(
              {
                name: profile.name["givenName"],
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
                image: profile.photos[0].value,
                type: "Admin",
                department: Admin.findAdmin(profile.emails[0].value),
              },
              (err, user) => {
                if (err) {
                  console.log(
                    "Error in creating user google strategy-passport",
                    err
                  );
                  return;
                }
                return done(null, user);
              }
            );
          }
        });
      } else if (getProffName.isProff(profile.emails[0].value)) {
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
          if (err) {
            console.log("Error in google strategy passport", err);
            return;
          }
          if (user) {            
            user['type']='proff';
            user["name"] = profile.name["givenName"];
            user.save();           
            return done(null, user);
          } else {
            User.create(
              {
                name: profile.name["givenName"],
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
                image: profile.photos[0].value,
                type: "Proff",
              },
              (err, user) => {
                if (err) {
                  console.log(
                    "Error in creating user google strategy-passport",
                    err
                  );
                  return;
                }
                return done(null, user);
              }
            );
          }
        });
      } else {
        User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
          if (err) {
            console.log("Error in google strategy passport", err);
            return;
          }
          if (user) {
            if(user['type']){
              return done(null,false);
            }
            return done(null, user);
          } else {
            var details = getGender(profile.emails[0].value, students_data);
            if (!details) {
              return done(null, false);
            }

            User.create(
              {
                name: details[4],
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
                image: profile.photos[0].value,
                designLabApplied: false,
                libraryApplied: false,
                adminFacilitiesApplied: false,
                systemAdminAndNetworkingApplied: false,
                sportsAndStudentFacilitiesApplied: false,
                hostelApplied: false,
                eceLabsApplied: false,
                placementInchargeApplied: false,
                incubationCenterApplied: false,
                researchAndProjectApplied: false,
                financeApplied: false,
                academicsApplied: false,
                ipList: [],
                btpList: [],
                gender: details[0],
                department: details[1],
                degree: details[2],
                roll: details[3],
                batch: Number(details[3].substring(0, 4)) + 4,
              },
              (err, user) => {
                if (err) {
                  console.log(
                    "Error in creating user google strategy-passport",
                    err
                  );
                  return;
                }
                return done(null, user);
              }
            );
          }
        });
      }
    }
  )
);
