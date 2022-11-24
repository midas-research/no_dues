const axios = require('axios');
var XMLHttpRequest = require('xhr2');
// const {CURRENT_URL}= require('../config/config');

var xhr = new XMLHttpRequest();
var admins_data;
// axios.get(`${CURRENT_URL}/user/getAdmins`).then(function (response) {
//     }).catch(function (error) {
//         console.log(error);
//     });

var admins_data = require('../data/admins.json');
// console.log("the admin datas are ===>>>", admins_data);

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
// console.log("the names are ===>>>", names);

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

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
    gender: {type: String },
    ip: { type: Boolean },
    ipProf: { type: String },
    ipApplied:{type: Boolean},
    ipAppliedAt: { type: String },
    ipApprovedAt: { type: String },
    ipProjectName: { type: String },
    ipMessage: { type: String },
    ipProjectDescription: { type: String },     
    btp: { type: Boolean },
    btpProf: { type: String },
    btpApplied:{type: Boolean},
    btpAppliedAt: { type: String },
    btpApprovedAt: { type: String },
    btpMessage: { type: String }, 
    btpProjectName: { type: String }, 
    btpProjectDescription: { type: String },
    bankName: {type: String},
    bankBranch: {type: String},
    bankAccountNo: {type: String},
    bankAccountHolder: {type:String},
    bankIfscCode: {type: String},
    mobile: {type: String},
    other_email: {type: String},
    date_of_leaving: {type: String},
    reason_of_leaving: {type: String},
    nodues:{type: Boolean},
    noduesMessage:{type: String},
    noduesApprovedAt:{ type: String}
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
// request.open('GET', `${CURRENT_URL}/user/getAdmins`, false);
// request.send(null);
// if (request.status === 200) {
//   adminsList = JSON.parse(request.responseText);
//   admins_data = adminsList
// }