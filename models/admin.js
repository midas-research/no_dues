const mongoose = require("mongoose");
const { adminNames } = require("../data/getAdminName");

const userSchema = new mongoose.Schema(
  {
    admin: { type: String, required: true },
    emails: { type: Array },
    displayName: { type: String },
    displayAddress: { type: String },
    originalAdminName: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", userSchema);

module.exports.db = Admin;

function format(name) {
  if (name.substring(0, 9) == "Academics") {
    return "academics" + name[11];
  }
  var arr = name.split(" ");
  var newName = arr[0].toLowerCase();
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] == "&") {
      arr[i] = "And";
    }
    newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1);
  }
  return newName;
}

let admins = [];
let original = {};
let adminEmails = {};

module.exports.addAdmins = (data) => {
  for (var i = 1; i < data.length; i++) {
    let details = data[i];

    let originalName = details[0];
    let adminName = format(originalName);
    if(adminName.substring(0,9)!='academics'){
      admins.push(adminName);
    }    
    original[adminName] = originalName;

    let displayName = details[1];
    let displayAddress = details[2];

    let mails = [];

    let j = 3;

    while (j < details.length) {
      let mail = details[j];
      if (j != "") {
        mails.push(mail);
        adminEmails[mail] = adminName;
      } else {
        break;
      }
      j++;
    }

    Admin.create({
      admin: adminName,
      emails: mails,
      displayName: displayName,
      displayAddress: displayAddress,
      originalAdminName: originalName,
    });
  }
  admins.push('academics');
  console.log("Admin Data Added");
};

module.exports.admins = admins;
module.exports.original = original;
module.exports.adminEmails = adminEmails;

module.exports.findAdmin = (email) => {
  if (email in adminEmails) {
    return adminEmails[email];
  } else {
    return "student";
  }
};

module.exports.getOriginalAdmin = (adminName) => {
  return original[adminName];
};

module.exports.checkAdmin = (email) => {
  if (email in adminEmails) {
    return true;
  } else {
    return false;
  }
};
