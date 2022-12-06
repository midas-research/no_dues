
var user = JSON.parse(document.getElementById('user').innerHTML);
let professorsList;
let admins_list;
let studentsList;

const CURRENT_URL= JSON.parse(document.getElementById('CURRENT_URL').innerHTML);

var request = new XMLHttpRequest();
request.open('GET', `${CURRENT_URL}/user/getProfessors`, false);
request.send(null);
if (request.status === 200) {
  professorsList = JSON.parse(request.responseText);
}

var request = new XMLHttpRequest();
request.open('GET', `${CURRENT_URL}/user/getAdmins`, false);
request.send(null);
if (request.status === 200) {
  admins_list = JSON.parse(request.responseText);
}


var request = new XMLHttpRequest();
request.open('GET', `${CURRENT_URL}/user/getStudents`, false);
request.send(null);
if (request.status === 200) {
  studentsList = JSON.parse(request.responseText);
}


var request = new XMLHttpRequest();
var getDeptShortName;
request.open('GET', `${CURRENT_URL}/getFunction`, false);
request.send(null);
if (request.status === 200) {
  getDeptShortName = JSON.parse(request.responseText);
}

var admins = [];
for (var i=0; i<admins_list.length-2; i++) {
  admins.push(getAdminName(admins_list[i][0]));
}
let count=0;

for(var i in admins){
  if(user[0][admins[i]]==true){
    count+=1;
  }
}
if(user[0]['ip']==true){
  count+=1;
}
if(user[0]['btp']==true){
  count+=1;
}

document.getElementById('countCleared').innerHTML=`${count}`;
document.getElementById('countAll').innerHTML=`${admins.length+2}`;


function additionalInfo(admin){
  if(admin=='hostel'){
    return `<br>
            Did you ever take hostel?
            <br>
            <input type="radio" id="taken" name="hostelTaken" value=true>
            <label for="taken">Yes</label><br>
            <input type="radio" id="notTaken" name="hostelTaken" value=false>
            <label for="notTaken">No </label><hr>`  

  }
  else{
    return'';
  }
}

function requestFunction(event) {
  event.stopPropagation();
  var list=event.target.classList;
  if (list.contains('request')==false){
    return;
  }
  var adminName = getAdminName(event.target.previousElementSibling.innerHTML);
  
  if (user[0][adminName+'Applied']) {
    alert('You have already requested!');
    return;
  }

  var hostelTaken=undefined;

  if(adminName=='hostel'){
    var ele = document.getElementsByName('hostelTaken');
      
    for(i = 0; i < ele.length; i++) {
          
        if(ele[i].type="radio") {          
          if(ele[i].checked){
            hostelTaken=ele[i].value;
            break;
          }                
        }
    }

    if(hostelTaken==undefined){
      alert('Please tell your hostel status! ');
      return;
    }
  }

  var obj = [];
  obj.push({
    studentEmail: user[0].email,
    adminName: adminName,
    hostelTaken: hostelTaken
  });
  window.location.href = `${CURRENT_URL}/request/${JSON.stringify(obj)}`;
}

var container = document.getElementById('admins_list_container');
for (var i=0; i<admins_list.length-3; i++){
  
  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[i][0]}</span>
        <!-- <span class="send_request">Send</span> -->
        
        <i class="fas fa-share request ${getDeptShortName[admins_list[i][1]]+'Symbol'} " onclick="requestFunction(event)" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
        <span class="icon" aria-hidden="true"></span>
    </button>
    <div class="accordion-content">
        ${additionalInfo(getDeptShortName[admins_list[i][1]])}        
        <p>Admin - ${admins_list[i][2]}</p>
        <p id="${getDeptShortName[admins_list[i][1]]+'Message'}" class="message">There are no comments from the admin of this department.</p>
    </div>
  </div>`
}

if (user[0]['degree'] == 'B. Tech') {

  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[admins_list.length-3][0]}</span>
        <!-- <span class="send_request">Send</span> -->        
        <i class="fas fa-share request ${getDeptShortName[admins_list[i][1]]+'Symbol'} " onclick="requestFunction(event)" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
        <span class="icon" aria-hidden="true"></span>
    </button>
    <div class="accordion-content">
        <p>Admin - ${admins_list[admins_list.length-3][2]}</p>
        <p id="${getDeptShortName[admins_list[admins_list.length-3][1]]+'Message'}" class="message">There are no comments from the admin of this department.</p>
    </div>
  </div>`
}

if (user[0]['degree'] == 'M. Tech') {
  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[admins_list.length-2][0]}</span>
        <!-- <span class="send_request">Send</span> -->
        <i class="fas fa-share request ${getDeptShortName[admins_list[i][1]]+'Symbol'} " onclick="requestFunction(event)" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
        <span class="icon" aria-hidden="true"></span>
    </button>
    <div class="accordion-content">
        <p>Admin - ${admins_list[admins_list.length-2][2]}</p>
        <p id="${getDeptShortName[admins_list[admins_list.length-2][1]]+'Message'}" class="message">There are no comments from the admin of this department.</p>
    </div>
  </div>`
}

if (user[0]['degree'] == 'PhD') {
  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[admins_list.length-1][0]}</span>
        <!-- <span class="send_request">Send</span> -->
        <i class="fas fa-share request ${getDeptShortName[admins_list[i][1]]+'Symbol'} " onclick="requestFunction(event)" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
        <span class="icon" aria-hidden="true"></span>
    </button>
    <div class="accordion-content">
        <p>Admin - ${admins_list[admins_list.length-1][2]}</p>
        <p id="${getDeptShortName[admins_list[admins_list.length-1][1]]+'Message'}" class="message">There are no comments from the admin of this department.</p>
    </div>
  </div>`
}

container.innerHTML += `<div class="accordion-item">
  <button id="accordion-button-11" aria-expanded="false">
    <span class="accordion-title">BTP / Scholarly Paper / Thesis</span>
    <i id="btp_sendRequest" class="fas fa-share request btp_signal" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
    <span class="icon" aria-hidden="true"></span>
  </button>
  <div class="accordion-content">
      <label for="proffs">Choose professor:  </label>
      <select name="proffs" id="btp_proff">
        <option value="None">None</option>
      </select>
      
      <br>
      
      <label  for="projectName">Project Name: 
        <input type="text" id="btpProjectName" class="form-control" placeholder="Enter Project Name">
      </label>
      <br>
      
      <label for="projectDescription">Project Description:
        <textarea class="form-control" id="btpProjectDescription" rows="3" cols="30" ></textarea>
      </label>
      <br>
      Comments: 
      <p id="btp_comment">There are no comments from the professor.</p>
  </div>
  </div>
  <div class="accordion-item">
  <button id="accordion-button-11" aria-expanded="false">
    <span class="accordion-title">IP / IS / UR</span>
    <i id="ip_sendRequest" class="fas fa-share request ip_signal" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
    <span class="icon" aria-hidden="true"></span>
  </button>
  <div class="accordion-content">
      <label for="proffs">Choose professor:  </label>
      <select name="proffs" id="ip_proff">
        <option value="None">None</option>
      </select>
      
      <br>
      
      <label  for="projectName">Project Name: 
        <input type="text" id="ipProjectName" class="form-control" placeholder="Enter Project Name">
      </label>
      <br>
      
      <label for="projectDescription">Project Description:
        <textarea class="form-control" id="ipProjectDescription" rows="3" cols="30" ></textarea>
      </label>
      <br>
      Comments: 
      <p id="ip_comment">There are no comments from the professor.</p>
      
  </div>
</div>`

var btp_proff = document.getElementById('btp_proff');
for (var i in professorsList) {
  var newOption = document.createElement('option');
  var optionText = document.createTextNode(professorsList[i][0]);
  newOption.appendChild(optionText);
  newOption.setAttribute('value', professorsList[i][0]);
  btp_proff.appendChild(newOption);
}

var ipproffs = document.getElementById('ip_proff');
for (var i in professorsList) {
  var newOption = document.createElement('option');
  var optionText = document.createTextNode(professorsList[i][0]);
  newOption.appendChild(optionText);
  newOption.setAttribute('value', professorsList[i][0]);
  ipproffs.appendChild(newOption);
}

function getAdminName(s) {
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

var modal = document.getElementById("myModal");
var modal1 = document.getElementById('myModal1');
var closeModal = document.getElementsByClassName("close")[0];
var closeModal1 = document.getElementsByClassName("close1")[0];
var submitModal = document.querySelector('.modal input[type="submit"]');
var submitModal1 = document.querySelector('.modal1 input[type="submit"]');
var bankName, bankBranch, bankAccountNo, bankIfscCode, bankAccountHolder;
document.getElementById('bankName').onkeypress = function() {
  document.getElementById('bankNameWarning').style.display = "none";
}
document.getElementById('bankBranch').onkeypress = function() {
  document.getElementById('bankBranchWarning').style.display = "none";
}
document.getElementById('bankAccountNo').onkeypress = function() {
  document.getElementById('bankAccountNoWarning').style.display = "none";
}
document.getElementById('bankAccountHolder').onkeypress = function() {
  document.getElementById('bankAccountHolderWarning').style.display = "none";
}
document.getElementById('bankIfscCode').onkeypress = function() {
  document.getElementById('bankIfscCodeWarning').style.display = "none";
}
var personalMobile, personalEmail, leavingDate, leavingReason, completed, withdrawal;
document.getElementById('personalMobile').onkeypress = function() {
  document.getElementById('personalMobileWarning').style.display = "none";
}
document.getElementById('personalEmail').onkeypress = function() {
  document.getElementById('personalEmailWarning').style.display = "none";
}
document.getElementById('leavingDate').onkeypress = function() {
  document.getElementById('leavingDateWarning').style.display = "none";
}
document.getElementById('completed').onclick = function() {
  document.getElementById('leavingReasonWarning').style.display = "none";
}
document.getElementById('withdrawal').onclick = function() {
  document.getElementById('leavingReasonWarning').style.display = "none";
}
submitModal.onclick = function() {
  bankName = document.getElementById('bankName').value;
  bankBranch = document.getElementById('bankBranch').value;
  bankAccountNo = document.getElementById('bankAccountNo').value;
  bankIfscCode = document.getElementById('bankIfscCode').value;
  bankAccountHolder=document.getElementById('bankAccountHolder').value;
  var c=0;
  if (bankName=="") {
    document.getElementById('bankNameWarning').style.display = "block";
    c++;
  }
  if (bankBranch=="") {
    document.getElementById('bankBranchWarning').style.display = "block";
    c++;
  }
  if (bankAccountNo=="") {
    document.getElementById('bankAccountNoWarning').style.display = "block";
    c++;
  }
  if (bankIfscCode=="") {
    document.getElementById('bankIfscCodeWarning').style.display = "block";
    c++;
  }
  if (bankAccountHolder=="") {
    document.getElementById('bankAccountHolderWarning').style.display = "block";
    c++;
  }
  if (c>0) {return;}
  var bankDetails = {};
  bankDetails.bankName = bankName;
  bankDetails.bankBranch = bankBranch;
  bankDetails.bankAccountNo = bankAccountNo;
  bankDetails.bankIfscCode = bankIfscCode;
  bankDetails.bankAccountHolder = bankAccountHolder;
  bankDetails.email = user[0]['email'];
  window.location.href = `${CURRENT_URL}/sendBankDetails/${JSON.stringify(bankDetails)}`;
  modal.style.display = "none";
}
submitModal1.onclick = function() {
  personalMobile = document.getElementById('personalMobile').value;
  personalEmail = document.getElementById('personalEmail').value;
  leavingDate = document.getElementById('leavingDate').value;
  withdrawal = document.getElementById('withdrawal');
  completed = document.getElementById('completed');
  var c=0;
  if (personalMobile=="") {
    document.getElementById('personalMobileWarning').style.display = "block";
    c++;
  }
  if (personalEmail=="") {
    document.getElementById('personalEmailWarning').style.display = "block";
    c++;
  }
  if (leavingDate=="") {
    document.getElementById('leavingDateWarning').style.display = "block";
    c++;
  }
  if (!withdrawal.checked && !completed.checked) {
    document.getElementById('leavingReasonWarning').style.display = "block";
    c++;
  }
  if (c>0) {return;}
  var personalDetails = {};
  personalDetails.personalMobile = personalMobile;
  personalDetails.personalEmail = personalEmail;
  personalDetails.leavingDate = leavingDate;
 
  if (withdrawal.checked) {
    personalDetails.leavingReason = 'withdrawal';
  }
  if (completed.checked) {
    personalDetails.leavingReason = 'completed';
  }

  personalDetails.email = user[0]['email'];
  window.location.href = `${CURRENT_URL}/sendPersonalDetails/${JSON.stringify(personalDetails)}`;
  modal1.style.display = "none";
}

// When the user clicks on the button, open the modal
window.onload = function() {
  if (!user[0]['bankName'] || !user[0]['bankBranch'] || !user[0]['bankAccountNo'] || !user[0]['bankIfscCode']) {
    modal.style.display = "block";
  }
}
var uploadBankDetails = document.getElementById('uploadBankDetails');
uploadBankDetails.onclick = function() {
  modal.style.display = "block";
  if (user[0].bankName!=undefined) {
    document.getElementById('bankName').value = user[0].bankName;
  }
  if (user[0].bankBranch!=undefined) {
    document.getElementById('bankBranch').value = user[0].bankBranch;
  }
  if (user[0].bankAccountNo!=undefined) {
    document.getElementById('bankAccountNo').value = user[0].bankAccountNo;
  }
  if (user[0].bankIfscCode!=undefined) {
    document.getElementById('bankIfscCode').value = user[0].bankIfscCode;
  }
}

var uploadPersonalDetails = document.getElementById('uploadPersonalDetails');
uploadPersonalDetails.onclick = function() {
  modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  modal.style.display = "none";
}
closeModal1.onclick = function() {
  modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}

const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');
  
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  
  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

function updateSymbolMessage(user,admin){
  // console.log(admin);
  var symbol = document.getElementsByClassName(admin+'Symbol')[0];

  if (user[0][admin+'Message'] && !user[0][admin]) {
    document.getElementById(admin+'Message').innerHTML = user[0][admin+'Message'];
    symbol.classList.remove('fa-share');
    symbol.classList.remove('request');
    symbol.classList.add('send_request');
    symbol.classList.remove('fa-spinner');
    symbol.classList.add('fa-times-circle');
    symbol.setAttribute('title','Not Cleared');
  }
  else if (user[0][admin+'Applied'] && !user[0][admin]) {
    var symbol = document.getElementsByClassName(admin+'Symbol')[0];
    
    symbol.classList.remove('fa-share');
    symbol.classList.remove('request');
    symbol.classList.add('send_request');
    symbol.classList.add('fa-spinner');
    symbol.setAttribute('title','Pending');
  }
  else if (user[0][admin+'Applied'] && user[0][admin]==true) {
    if (symbol.classList.contains('fa-spinner')) {
      symbol.classList.remove('fa-spinner');
      symbol.classList.add('fa-check-circle');
      symbol.setAttribute('title','Cleared');
    } else if (symbol.classList.contains('fa-times-circle')) {
      symbol.classList.remove('fa-times-circle');
      symbol.classList.add('fa-check-circle');
      symbol.setAttribute('title','Cleared');
    } else if (symbol.classList.contains('fa-share')) {
     
      symbol.classList.remove('fa-share');
      symbol.classList.remove('request');
      symbol.classList.add('send_request');
      symbol.classList.add('fa-check-circle');
      symbol.setAttribute('title','Cleared');
    }
    document.getElementById(admin+'Message').innerHTML = 'Dues for this department has been approved';    
  }

  
}


items.forEach(item => item.addEventListener('click', toggleAccordion));

for (var i in admins) {

  updateSymbolMessage(user,admins[i]);
}

setInterval(() => {
  var request = new XMLHttpRequest();
  request.open('GET', `${CURRENT_URL}/user/getUser/${user[0]._id}`, false);
  request.send(null);
  if (request.status === 200) {
    user = [];
    user.push(JSON.parse(request.responseText));
  }

  for (var i in admins) {
    updateSymbolMessage(admins[i]);   
  }
}, 5000);

var reverseProfessorList = {};
var professorList = {};
for (var i in professorsList) {
  professorList[professorsList[i][0]] = professorsList[i][1];
  reverseProfessorList[professorsList[i][1]] = professorsList[i][0];
}

var btp_sendRequest = document.getElementById('btp_sendRequest');
var ip_sendRequest = document.getElementById('ip_sendRequest');

var btp_proff = document.getElementById('btp_proff');

if (user[0]['btpApplied']==true) {
  btp_proff.value = reverseProfessorList[user[0]['btp']];
}
var btp_signal = document.getElementsByClassName('btp_signal')[0];
// console.log(btp_signal);
if (user[0]['btpApplied']==true) {
  btp_signal.removeAttribute('id');
  btp_signal.classList.remove('fa-share');
  btp_signal.classList.remove('request');
  btp_signal.classList.add('send_request');
  btp_signal.classList.add('fa-spinner');
  btp_signal.style.color = 'blue';
  btp_signal.setAttribute('title','Pending');
  // console.log("btp else if");
}
if (user[0]['btp'==false]) {
  btp_signal.removeAttribute('id');
  console.log(btp_signal.id);
  btp_signal.classList.remove('fa-spinner');
  btp_signal.classList.remove('fa-check-circle');
  btp_signal.classList.remove('fa-dot-circle');
  btp_signal.classList.remove('request');
  btp_signal.classList.add('send_request');
  btp_signal.classList.add('fa-times-circle');
  btp_signal.style.color = 'red';
  btp_signal.setAttribute('title','Rejected');
  // console.log("btp reject");
}
if (user[0]['btp']==true) {
  btp_signal.removeAttribute('id');
  btp_signal.classList.remove('fa-times-circle');
  btp_signal.classList.remove('fa-spinner');
  btp_signal.classList.remove('fa-share');
  btp_signal.classList.remove('request');
  btp_signal.classList.add('send_request');
  btp_signal.classList.add('fa-check-circle');
  btp_signal.style.color = 'green';
  btp_signal.setAttribute('title','Cleared');
  // console.log("btp accept");
}

var btp_comment = document.getElementById('btp_comment');
if (user[0]['btp']==false && 'btpMessage' in user[0]) {
  btp_comment.innerHTML = user[0]['btpMessage'];
}
if (user[0]['btp']==true) {
  btp_comment.innerHTML = 'Your dues has been approved!';
}
var ip_comment = document.getElementById('ip_comment');
if (user[0]['ip']==false && 'ipMessage' in user[0]) {
  ip_comment.innerHTML = user[0]['ipMessage'];
}
if (user[0]['ip']==true) {
  ip_comment.innerHTML = 'Your dues has been approved!';
}
var btpProjectDescription = document.getElementById('btpProjectDescription');
var btpProjectName = document.getElementById('btpProjectName');

btp_sendRequest.addEventListener('click', () => {
  if(btp_sendRequest.classList.contains('fa-share')==false){
    return;
  }

  if (btp_proff.value=='None' || btp_proff.value=='') {
    alert('Kindly choose a professor!');
    return;
  }

  if (user[0]['btpApplied']==true) {
    alert (`You have already sent a requst to ${reverseProfessorList[user[0]['btpProf']]}`);
    return;
  }
  if (btpProjectName.value=='None' || btpProjectName.value=='') {
    alert('Kindly Enter Project Name!');
    return;
  }
  if (btpProjectDescription.value=='None' || btpProjectDescription.value=='') {
    alert('Kindly Enter Project Description!');
    return;
  }
  var obj = [];
  obj.push({
    admin : 'btp',
    proffEmail : professorList[btp_proff.value],
    studentEmail: user[0]['email'],
    projectName:btpProjectName.value,
    projectDescription: btpProjectDescription.value
  });
  console.log(obj);
  window.location.href = `${CURRENT_URL}/sendBtpRequest/${JSON.stringify(obj)}`;
});

var ip_proff = document.getElementById('ip_proff');
if (user[0]['ipApplied']==true) {
  ip_proff.value = reverseProfessorList[user[0]['ip']];
}
var ip_signal = document.getElementsByClassName('ip_signal')[0];
// console.log(ip_signal);
// console.log(user[0]['ipApplied']);
// console.log(user[0]['ip']);
// console.log(user[0]['ipApplied']==true);

if (user[0]['ipApplied']==true) {
  ip_signal.removeAttribute('id');
  ip_signal.classList.remove('fa-share');
  ip_signal.classList.remove('request');
  ip_signal.classList.add('send_request'); 
  ip_signal.classList.add('fa-spinner');
  ip_signal.style.color = 'blue';
  ip_signal.setAttribute('title','Pending');
  // console.log("else if");
}
if (user[0]['ip']==false) {
  ip_signal.removeAttribute('id');
  ip_signal.classList.remove('fa-spinner');
  ip_signal.classList.remove('fa-check-circle');
  ip_signal.classList.remove('fa-share');
  ip_signal.classList.remove('request');
  ip_signal.classList.add('send_request');
  ip_signal.classList.add('fa-times-circle');
  ip_signal.style.color = 'red';
  ip_signal.setAttribute('title','Rejected');
  // console.log("red");
}
if (user[0]['ip']==true) {
  ip_signal.removeAttribute('id');
  ip_signal.classList.remove('fa-times-circle');
  ip_signal.classList.remove('fa-spinner');
  ip_signal.classList.remove('fa-share');
  ip_signal.classList.remove('request');
  ip_signal.classList.add('send_request');
  ip_signal.classList.add('fa-check-circle');
  ip_signal.style.color = 'green';
  ip_signal.setAttribute('title','Cleared');
  // console.log("green");
}
var ipProjectDescription = document.getElementById('ipProjectDescription');
var ipProjectName = document.getElementById('ipProjectName');

ip_sendRequest.addEventListener('click', () => {
  if(ip_sendRequest.classList.contains('fa-share')==false){
    return;
  }
  if (ip_proff.value=='None' || ip_proff.value=='') {
    alert('Kindly choose a professor!');
    return;
  }
  if (user[0]['ipApplied']==true) {
    alert (`You have already sent a requst to ${reverseProfessorList[user[0]['ipProf']]}`);
    return;
  }
  if (ipProjectName.value=='None' || ipProjectName.value=='') {
    alert('Kindly Enter Project Name!');
    return;
  }
  if (ipProjectDescription.value=='None' || ipProjectDescription.value=='') {
    alert('Kindly Enter Project Description!');
    return;
  }
  // console.log(ipProjectName.value);
  // console.log(ipProjectDescription.value);
  var obj = [];
  obj.push({
    admin: 'ip',
    proffEmail: professorList[ip_proff.value],
    studentEmail: user[0]['email'],
    projectName:ipProjectName.value,
    projectDescription: ipProjectDescription.value
  });
  console.log(obj);
  window.location.href = `${CURRENT_URL}/sendIpRequest/${JSON.stringify(obj)}`;
});

var downloadbtn = document.getElementById('downloadbtn');
downloadbtn.addEventListener('click', () => {
  var obj = {};
  obj.student = user[0];
  console.log(user[0].email);
  var c = 0;
  for (var i in admins) {
    if (user[0][admins[i]] == false) {
      c = c+1;
    }
  }
  // if (!user[0].bankName) {
  //   alert('Kindly fill in your bank details');
  // }
  // if (!user[0].mobile) {
  //   alert('Kindly fill in your personal details');
  // }
  // if (c > 0) {
  //   alert('Kindly get the approvals from all departments!');
  // }
  window.location.href = `${CURRENT_URL}/download/${user[0].email}`;
});

// document.onkeydown = function(e) {
//   if(event.keyCode == 123) {
//      return false;
//   }
//   if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
//      return false;
//   }
//   if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
//      return false;
//   }
//   if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
//      return false;
//   }
//   if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
//      return false;
//   }
// }

// document.addEventListener('contextmenu', function(e) {
//   e.preventDefault();
// });