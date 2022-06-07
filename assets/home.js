var user = JSON.parse(document.getElementById('user').innerHTML);
console.log(user);
const admins_list = JSON.parse(document.getElementById('admins').innerHTML);
console.log(admins_list);
var professorsList;
var adminsList;
var studentsList;

var request = new XMLHttpRequest();
request.open('GET', 'http://nodues.fh.iiitd.edu.in/user/getProfessors', false);
request.send(null);
if (request.status === 200) {
  professorsList = JSON.parse(request.responseText);
}

var request = new XMLHttpRequest();
request.open('GET', 'http://nodues.fh.iiitd.edu.in/user/getAdmins', false);
request.send(null);
if (request.status === 200) {
  adminsList = JSON.parse(request.responseText);
}

var request = new XMLHttpRequest();
request.open('GET', 'http://nodues.fh.iiitd.edu.in/user/getStudents', false);
request.send(null);
if (request.status === 200) {
  studentsList = JSON.parse(request.responseText);
}

var request = new XMLHttpRequest();
var getDeptShortName;
request.open('GET', 'http://nodues.fh.iiitd.edu.in/getFunction', false);
request.send(null);
if (request.status === 200) {
  getDeptShortName = JSON.parse(request.responseText);
}

// function getDeptShortName(email) {
//   if (email == 'admin-dilabs@iiitd.ac.in') {
//     return 'designLab';
//   } else if (email == 'rajendra@iiitd.ac.in') {
//       return 'library';
//   } else if (email == 'admin-facilities@iiitd.ac.in') {
//       return 'adminFacilities';
//   }  else if (email == 'ravi@iiitd.ac.in') {
//     return 'hostel';
//   } else if (email == 'abhinay@iiitd.ac.in') {
//       return 'systemAdmin';
//   } else if (email == 'ravi@iiitd.ac.in') {
//       return 'sports';
//   } else if (email == 'rahul@iiitd.ac.in') {
//       return 'eceLabs';
//   } else if (email == 'rashmil@iiitd.ac.in') {
//       return 'placement';
//   } else if (email == 'geetagupta@iiitdic.in') {
//       return 'incubation';
//   } else if (email == 'varsha@iiitd.ac.in') {
//       return 'finance';
//   } else if (email=='no-dues@iiitd.ac.in' || email=='admin-mtech@iiitd.ac.in' || email=='admin-phd@iiitd.ac.in') {
//       return 'academics';
//   } else {
//       return 'student';
//   }
// }

function requestFunction(event) {
  event.stopPropagation();
  adminName = getAdminName(event.target.previousElementSibling.innerHTML);
  console.log(adminName);
  if (user[0][adminName+'Applied']) {
    alert('You have already requested!');
    return;
  }
  var obj = [];
  obj.push({
    studentEmail: user[0].email,
    adminName: adminName
  });
  window.location.href = `http://nodues.fh.iiitd.edu.in/request/${JSON.stringify(obj)}`;
}

var container = document.getElementById('admins_list_container');
for (var i=0; i<admins_list.length-3; i++){
  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[i][0]}</span>
        <!-- <span class="send_request">Send</span> -->
        <i class="fas fa-share request" onclick="requestFunction(event)"></i>
        <i class="fas fa-dot-circle send_request ${getDeptShortName[admins_list[i][1]]+'Symbol'} statusSymbol"></i>
        <span class="icon" aria-hidden="true"></span>
    </button>
    <div class="accordion-content">
        <p>Admin - ${admins_list[i][2]}</p>
        <p id="${getDeptShortName[admins_list[i][1]]+'Message'}" class="message">There are no comments from the admin of this department.</p>
    </div>
  </div>`
}

if (user[0]['degree'] == 'B. Tech') {
  console.log(getDeptShortName[admins_list[admins_list.length-3][1]]);
  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[admins_list.length-3][0]}</span>
        <!-- <span class="send_request">Send</span> -->
        <i class="fas fa-share request" onclick="requestFunction(event)"></i>
        <i class="fas fa-dot-circle send_request ${getDeptShortName[admins_list[admins_list.length-3][1]]+'Symbol'} statusSymbol"></i>
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
        <i class="fas fa-share request" onclick="requestFunction(event)"></i>
        <i class="fas fa-dot-circle send_request ${getDeptShortName[admins_list[admins_list.length-2][1]]+'Symbol'} statusSymbol"></i>
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
        <i class="fas fa-share request" onclick="requestFunction(event)"></i>
        <i class="fas fa-dot-circle send_request ${getDeptShortName[admins_list[admins_list.length-1][1]]+'Symbol'} statusSymbol"></i>
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
    <i class="fas fa-share request" id="btp_sendRequest"></i>
    <i class="fas fa-dot-circle send_request btp_signal"></i>
    <span class="icon" aria-hidden="true"></span>
  </button>
  <div class="accordion-content">
      <label for="proffs">Choose professor:</label>
      <select name="proffs" id="btp_proff">
        <option value="None">None</option>
      </select>
      <p id="btp_comment">There are no comments from the professor.</p>
  </div>
  </div>
  <div class="accordion-item">
  <button id="accordion-button-11" aria-expanded="false">
    <span class="accordion-title">IP / IS / UR</span>
    <i class="fas fa-share request" id="ip_sendRequest"></i>
    <i class="fas fa-dot-circle send_request ip_signal"></i>
    <span class="icon" aria-hidden="true"></span>
  </button>
  <div class="accordion-content">
      <label for="proffs">Choose professor:</label>
      <select name="proffs" id="ip_proff">
        <option value="None">None</option>
      </select>
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
// var admins = ['designLab', 'library', 'adminFacilities', 'systemAdmin', 'sports',
// 'hostel', 'eceLabs', 'placement', 'incubation', 'finance', 'academics'];
var admins = [];
for (var i=0; i<admins_list.length-2; i++) {
  admins.push(getAdminName(admins_list[i][0]));
}

var modal = document.getElementById("myModal");
var modal1 = document.getElementById('myModal1');
var closeModal = document.getElementsByClassName("close")[0];
var closeModal1 = document.getElementsByClassName("close1")[0];
var submitModal = document.querySelector('.modal input[type="submit"]');
var submitModal1 = document.querySelector('.modal1 input[type="submit"]');
var bankName, bankBranch, bankAccountNo, bankIfscCode;
document.getElementById('bankName').onkeypress = function() {
  document.getElementById('bankNameWarning').style.display = "none";
}
document.getElementById('bankBranch').onkeypress = function() {
  document.getElementById('bankBranchWarning').style.display = "none";
}
document.getElementById('bankAccountNo').onkeypress = function() {
  document.getElementById('bankAccountNoWarning').style.display = "none";
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
  if (c>0) {return;}
  var bankDetails = {};
  bankDetails.bankName = bankName;
  bankDetails.bankBranch = bankBranch;
  bankDetails.bankAccountNo = bankAccountNo;
  bankDetails.bankIfscCode = bankIfscCode;
  bankDetails.email = user[0]['email'];
  window.location.href = `http://nodues.fh.iiitd.edu.in/sendBankDetails/${JSON.stringify(bankDetails)}`;
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
  console.log(personalDetails.leavingDate);
  if (withdrawal.checked) {
    personalDetails.leavingReason = 'withdrawal';
  }
  if (completed.checked) {
    personalDetails.leavingReason = 'completed';
  }
  console.log(personalDetails.leavingReason);
  personalDetails.email = user[0]['email'];
  window.location.href = `http://nodues.fh.iiitd.edu.in/sendPersonalDetails/${JSON.stringify(personalDetails)}`;
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

items.forEach(item => item.addEventListener('click', toggleAccordion));

for (var i in admins) {
  if (user[0][admins[i]+'Message'] && !user[0][admins[i]]) {
    document.getElementById(admins[i]+'Message').innerHTML = user[0][admins[i]+'Message'];
    var symbol = document.getElementsByClassName(admins[i]+'Symbol')[0];
    symbol.classList.remove('fa-spinner');
    symbol.classList.add('fa-times-circle');
  }
  if (user[0][admins[i]+'Applied'] && !user[0][admins[i]]) {
    var symbol = document.getElementsByClassName(admins[i]+'Symbol')[0];
    console.log(document.getElementsByClassName(admins[i]+'Symbol')[0]);
    symbol.classList.remove('fa-dot-circle');
    symbol.classList.add('fa-spinner');
  }
  if (user[0][admins[i]+'Applied'] && user[0][admins[i]]) {
    var symbol = document.getElementsByClassName(admins[i]+'Symbol')[0];
    if (symbol.classList.contains('fa-spinner')) {
      symbol.classList.remove('fa-spinner');
      symbol.classList.add('fa-check-circle');
    } else if (symbol.classList.contains('fa-times-circle')) {
      symbol.classList.remove('fa-times-circle');
      symbol.classList.add('fa-check-circle');
    } else if (symbol.classList.contains('fa-dot-circle')) {
      symbol.classList.remove('fa-dot-circle');
      symbol.classList.add('fa-check-circle');
    }
    else {}
    document.getElementById(admins[i]+'Message').innerHTML = 'Dues for this department has been approved';
  }
}
setInterval(() => {
  var request = new XMLHttpRequest();
  request.open('GET', `http://nodues.fh.iiitd.edu.in/user/getUser/${user[0]._id}`, false);
  request.send(null);
  if (request.status === 200) {
    user = [];
    user.push(JSON.parse(request.responseText));
  }

  for (var i in admins) {
    if (user[0][admins[i]+'Message'] && !user[0][admins[i]]) {
      document.getElementById(admins[i]+'Message').innerHTML = user[0][admins[i]+'Message'];
      var symbol = document.getElementsByClassName(admins[i]+'Symbol')[0];
      symbol.classList.remove('fa-spinner');
      symbol.classList.add('fa-times-circle');
    }
    if (user[0][admins[i]+'Applied'] && !user[0][admins[i]]) {
      var symbol = document.getElementsByClassName(admins[i]+'Symbol')[0];
      console.log(document.getElementsByClassName(admins[i]+'Symbol')[0]);
      symbol.classList.remove('fa-dot-circle');
      symbol.classList.add('fa-spinner');
    }
    if (user[0][admins[i]+'Applied'] && user[0][admins[i]]) {
      var symbol = document.getElementsByClassName(admins[i]+'Symbol')[0];
      if (symbol.classList.contains('fa-spinner')) {
        symbol.classList.remove('fa-spinner');
        symbol.classList.add('fa-check-circle');
      } else if (symbol.classList.contains('fa-times-circle')) {
        symbol.classList.remove('fa-times-circle');
        symbol.classList.add('fa-check-circle');
      } else if (symbol.classList.contains('fa-dot-circle')) {
        symbol.classList.remove('fa-dot-circle');
        symbol.classList.add('fa-check-circle');
      }
      else {}
      document.getElementById(admins[i]+'Message').innerHTML = 'Dues for this department has been approved';
    }
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
if ('btp' in user[0]) {
  btp_proff.value = reverseProfessorList[user[0]['btp']];
}
var btp_signal = document.getElementsByClassName('btp_signal')[0];
if (user[0]['btp'] && !('btpApproved' in user[0])) {
  btp_signal.classList.remove('fa-dot-circle');
  btp_signal.classList.add('fa-spinner');
  btp_signal.style.color = 'blue';
}
if ('btpMessage' in user[0]) {
  btp_signal.classList.remove('fa-spinner');
  btp_signal.classList.remove('fa-check-circle');
  btp_signal.classList.remove('fa-dot-circle');
  btp_signal.classList.add('fa-times-circle');
  btp_signal.style.color = 'red';
}
if ('btpApproved' in user[0]) {
  btp_signal.classList.remove('fa-times-circle');
  btp_signal.classList.remove('fa-spinner');
  btp_signal.classList.remove('fa-dot-circle');
  btp_signal.classList.add('fa-check-circle');
  btp_signal.style.color = 'green';
}

var btp_comment = document.getElementById('btp_comment');
if (!('btpApproved' in user[0]) && ('btpMessage' in user[0])) {
  btp_comment.innerHTML = user[0]['btpMessage'];
}
if ('btpApproved' in user[0]) {
  btp_comment.innerHTML = 'Your dues has been approved!';
}
var ip_comment = document.getElementById('ip_comment');
if (!('ipApproved' in user[0]) && ('ipMessage' in user[0])) {
  ip_comment.innerHTML = user[0]['ipMessage'];
}
if ('ipApproved' in user[0]) {
  ip_comment.innerHTML = 'Your dues has been approved!';
}

btp_sendRequest.addEventListener('click', () => {
  if (btp_proff.value=='None' || btp_proff.value=='') {
    alert('Kindly choose a professor!');
    return;
  }
  if (user[0]['btp']) {
    alert (`You have already sent a requst to ${reverseProfessorList[user[0]['btp']]}`);
    return;
  }
  var obj = [];
  obj.push({
    admin : 'btp',
    proffEmail : professorList[btp_proff.value],
    studentEmail: user[0]['email']
  });
  console.log(obj);
  window.location.href = `http://nodues.fh.iiitd.edu.in/sendBtpRequest/${JSON.stringify(obj)}`;
});

var ip_proff = document.getElementById('ip_proff');
if ('ip' in user[0]) {
  ip_proff.value = reverseProfessorList[user[0]['ip']];
}
var ip_signal = document.getElementsByClassName('ip_signal')[0];
if (user[0]['ip'] && !('ipApproved' in user[0])) {
  ip_signal.classList.remove('fa-dot-circle');
  ip_signal.classList.add('fa-spinner');
  ip_signal.style.color = 'blue';
}
if ('ipMessage' in user[0]) {
  ip_signal.classList.remove('fa-spinner');
  ip_signal.classList.remove('fa-check-circle');
  ip_signal.classList.remove('fa-dot-circle');
  ip_signal.classList.add('fa-times-circle');
  ip_signal.style.color = 'red';
}
if ('ipApproved' in user[0]) {
  ip_signal.classList.remove('fa-spinnere');
  ip_signal.classList.remove('fa-times-circle');
  ip_signal.classList.remove('fa-dot-circle');
  ip_signal.classList.add('fa-check-circle');
  ip_signal.style.color = 'green';
}

ip_sendRequest.addEventListener('click', () => {
  if (ip_proff.value=='None' || ip_proff.value=='') {
    alert('Kindly choose a professor!');
    return;
  }
  if (user[0]['ip']) {
    alert (`You have already sent a requst to ${reverseProfessorList[user[0]['ip']]}`);
    return;
  }
  var obj = [];
  obj.push({
    admin: 'ip',
    proffEmail: professorList[ip_proff.value],
    studentEmail: user[0]['email']
  });
  console.log(obj);
  window.location.href = `http://nodues.fh.iiitd.edu.in/sendIpRequest/${JSON.stringify(obj)}`;
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
  window.location.href = `http://nodues.fh.iiitd.edu.in/download/${user[0].email}`;
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