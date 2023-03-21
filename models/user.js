const axios = require("axios");
var XMLHttpRequest = require("xhr2");
// const {CURRENT_URL}= require('../config/config');

var xhr = new XMLHttpRequest();
var admins_data;
// axios.get(`${CURRENT_URL}/user/getAdmins`).then(function (response) {
//     }).catch(function (error) {
//         console.log(error);
//     });

var admins_data = require("../data/admins.json");

function changeNameFormat(name) {
  if (name.substring(0, 9) == "Academics") {
    return "academics";
  }
  var arr = name.split(" ");
  var newName = arr[0].toLowerCase();
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] == "&") {
      arr[i] = "and";
    }
    newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1);
  }
  return newName;
}

var adminNames = {};
var names = [];
for (var i in admins_data) {
  adminNames[admins_data[i][1]] = changeNameFormat(admins_data[i][0]);
  names.push(changeNameFormat(admins_data[i][0]));
}

const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

var schemaObject = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true, unique: true },
  degree: { type: String },
  batch: { type: Number },
  type: { type: String },
  department: { type: String },
  roll: { type: String },
  gender: { type: String },
  ipList: [
    {
      ip: { type: Boolean },
      profEmail: { type: String },
      ipApplied: { type: Boolean },
      ipAppliedAt: { type: String },
      ipApprovedAt: { type: String },
      projectName: { type: String },
      ipMessage: { type: String },
      projectDescription: { type: String },
    },
  ],
  btpList: [
    {
      btp: { type: Boolean },
      profEmail: { type: String },
      btpApplied: { type: Boolean },
      btpAppliedAt: { type: String },
      btpApprovedAt: { type: String },
      btpMessage: { type: String },
      projectName: { type: String },
      projectDescription: { type: String },
    },
  ],
  bankName: { type: String },
  bankBranch: { type: String },
  bankAccountNo: { type: String },
  bankAccountHolder: { type: String },
  bankIfscCode: { type: String },
  mobile: { type: String },
  other_email: { type: String },
  date_of_leaving: { type: String },
  reason_of_leaving: { type: String },
  nodues: { type: Boolean, default: false },
  noduesMessage: { type: String },
  noduesApprovedAt: { type: String },
  hostelTaken: { type: Boolean, default: undefined },
  donationAdmin: { type: String, default: 'None' },
  donationAmount: {type: Number, default: 0},
  totalFine: {type:Number, default: 0},
};

for (var i = 0; i < names.length - 2; i++) {
  schemaObject[names[i]] = { type: Boolean };
  schemaObject[names[i] + "Applied"] = { type: Boolean };
  schemaObject[names[i] + "AppliedAt"] = { type: String };
  schemaObject[names[i] + "ApprovedAt"] = { type: String };
  schemaObject[names[i] + "Message"] = { type: String };
  schemaObject[names[i] + "Fine"] = { type: Number, default: 0 };
}

const userSchema = new mongoose.Schema(schemaObject, {
  timestamps: true,
});
const User = mongoose.model("User", userSchema);
module.exports = User;
