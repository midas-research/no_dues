const axios = require('axios');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
var admins_data;
// axios.get('http://localhost:8000/user/getAdmins').then(function (response) {
//     }).catch(function (error) {
//         console.log(error);
//     });

var admins_data = require('../data/admins.json');
console.log("the admin datas are ===>>>", admins_data);

function changeNameFormat(name) {
    if (name.substring(0,9) == 'Academics') {
        return 'academics';
    }
    var arr = name.split(" ");
    var newName = arr[0].toLowerCase();
    for (var i=1; i<arr.length; i++) {
        if (arr[i] == '&') {
            arr[i] = 'and';
        }
        newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1,);
    }
    return newName;
}

var adminNames = {};
var names = [];
for (var i in admins_data) {
    adminNames[admins_data[i][1]] = changeNameFormat(admins_data[i][0]);
    names.push(changeNameFormat(admins_data[i][0]));
}
console.log("the names are ===>>>", names);

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

var schemaObject = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true, unique: true },
    degree: { type: String },
    startYear: { type: String },
    type: { type: String },
    branch: { type: String },
    roll: { type: String },
    gender: {type: String },

    ip: { type: String },
    btp: { type: String },
    ipApproved: {type: Boolean},
    btpApproved: {type: Boolean},
    ipApplied: { type: String },
    btpApplied: { type: String },
    ipAppliedAt: { type: String },
    btpAppliedAt: { type: String },
    ipApprovedAt: { type: String },
    btpApprovedAt: { type: String },
    ipMessage: { type: String },
    btpMessage: { type: String },
    bankName: {type: String},
    bankBranch: {type: String},
    bankAccountNo: {type: String},
    bankIfscCode: {type: String},
    mobile: {type: String},
    other_email: {type: String},
    date_of_leaving: {type: String},
    reason_of_leaving: {type: String},
}

for (var i=0; i<names.length-2; i++) {
    schemaObject[names[i]] = { type: Boolean }
    schemaObject[names[i]+'Applied'] = { type: Boolean }
    schemaObject[names[i]+'AppliedAt'] = { type: String }
    schemaObject[names[i]+'ApprovedAt'] = { type: String }
    schemaObject[names[i]+'Message'] = { type: String }
}

const userSchema = new mongoose.Schema(schemaObject, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User;

// var request = new XMLHttpRequest();
// request.open('GET', 'http://localhost:8000/user/getAdmins', false);
// request.send(null);
// if (request.status === 200) {
//   adminsList = JSON.parse(request.responseText);
//   admins_data = adminsList
// }