const user = JSON.parse(document.getElementById('user').innerHTML);
console.log(user);
const admins_list = JSON.parse(document.getElementById('admins').innerHTML);
console.log(admins_list);

function getDeptShortName(email) {
  if (email == 'no-dues@iiitd.ac.in') {
    return 'designLab';
  } else if (email == 'rajendra@iiitd.ac.in') {
      return 'library';
  } else if (email == 'admin-facilities@iiitd.ac.in') {
      return 'adminFacilities';
  }  else if (email == 'ravi@iiitd.ac.in') {
    return 'hostel';
  } else if (email == 'abhinay@iiitd.ac.in') {
      return 'systemAdmin';
  } else if (email == 'ravi@iiitd.ac.in') {
      return 'sports';
  } else if (email == 'rahul@iiitd.ac.in') {
      return 'eceLabs';
  } else if (email == 'rashmil@iiitd.ac.in') {
      return 'placement';
  } else if (email == 'geetagupta@iiitdic.in') {
      return 'incubation';
  } else if (email == 'varsha@iiitd.ac.in') {
      return 'finance';
  } else if (email == 'admin-btech@iiitd.ac.in') {
      return 'academics';
  } else {
      return 'student';
  }
}

var container = document.getElementById('admins_list_container');
for (var i in admins_list){
  container.innerHTML += `<div class="accordion-item">
    <button id="accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${admins_list[i][0]}</span>
        <!-- <span class="send_request">Send</span> -->
        <i class="fas fa-share request" onclick="request(event)"></i>
        <i class="fas fa-dot-circle send_request ${getDeptShortName(admins_list[i][1])+'Symbol'} statusSymbol"></i>
        <span class="icon" aria-hidden="true"></span>
    </button>
    <div class="accordion-content">
        <p>Admin - ${admins_list[i][2]}</p>
        <p id="${getDeptShortName(admins_list[i][1])+'Message'}" class="message">There are no comments from the admin of this department.</p>
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
        <option value="Raghava Mutharaju">Raghava Mutharaju</option>
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
        <option value="Raghava Mutharaju">Raghava Mutharaju</option>
      </select>
      <p id="ip_comment">There are no comments from the professor.</p>
  </div>
</div>`

function getAdminName(s) {
  if (s == 'Design Lab') {return 'designLab';}
  if (s == 'Library') {return 'library';}
  if (s == 'Admin Facilities') {return 'adminFacilities';}
  if (s == 'System Admin &amp; Networking') {return 'systemAdmin';}
  if (s == 'Officer Sports &amp; Student Facilities') {return 'sports';}
  if (s == 'Hostel') {return 'hostel';}
  if (s == 'Junior Research Engineer(ECE Labs)') {return 'eceLabs';}
  if (s == 'Placement in-charge') {return 'placement';}
  if (s == 'Incubation center') {return 'incubation';}
  if (s == 'Finance &amp; Accounts') {return 'finance';}
  if (s == 'Academics') {return 'academics';}
}
var admins = ['designLab', 'library', 'adminFacilities', 'systemAdmin', 'sports',
'hostel', 'eceLabs', 'placement', 'incubation', 'finance', 'academics'];

var modal = document.getElementById("myModal");
var closeModal = document.getElementsByClassName("close")[0];
var submitModal = document.querySelector('.modal input[type="submit"]');
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
  window.location.href = `http://localhost:8000/sendBankDetails/${JSON.stringify(bankDetails)}`;
  modal.style.display = "none";
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
  document.getElementById('bankName').value = user[0].bankName;
  document.getElementById('bankBranch').value = user[0].bankBranch;
  document.getElementById('bankAccountNo').value = user[0].bankAccountNo;
  document.getElementById('bankIfscCode').value = user[0].bankIfscCode;
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
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

var professorList = {
  'Raghava Mutharaju' : 'scheduler@iiitd.ac.in',
};
var reverseProfessorList = {
  'scheduler@iiitd.ac.in' : 'Raghava Mutharaju',
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
  btp_signal.classList.add('fa-times-circle');
  btp_signal.style.color = 'red';
}
if ('btpApproved' in user[0]) {
  btp_signal.classList.remove('fa-times-circle');
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
  if (btp_proff.value == 'None') {
    alert('Kindly choose a professor!');
    return;
  }
  if (user[0]['btp']) {
    alert (`You have already sent a requst to ${reverseProfessorList[user[0]['btp']]}`)
  }
  var obj = [];
  obj.push({
    admin : 'btp',
    proffEmail : professorList[btp_proff.value],
    studentEmail: user[0]['email']
  });
  console.log(obj);
  window.location.href = `http://localhost:8000/sendBtpRequest/${JSON.stringify(obj)}`;
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
if (!('ipMessage') in user[0]) {
  ip_signal.classList.remove('fa-spinner');
  ip_signal.classList.add('fa-times-circle');
  ip_signal.style.color = 'red';
}
if ('ipApproved' in user[0]) {
  ip_signal.classList.remove('fa-times-circle');
  ip_signal.classList.add('fa-check-circle');
  ip_signal.style.color = 'green';
}

ip_sendRequest.addEventListener('click', () => {
  if (ip_proff.value == 'None') {
    alert('Kindly choose a professor!');
    return;
  }
  if (user[0]['ip']) {
    alert (`You have already sent a requst to ${reverseProfessorList[user[0]['ip']]}`)
  }
  var obj = [];
  obj.push({
    admin : 'ip',
    proffEmail : professorList[ip_proff.value],
    studentEmail: user[0]['email']
  });
  console.log(obj);
  window.location.href = `http://localhost:8000/sendIpRequest/${JSON.stringify(obj)}`;
});

var downloadbtn = document.getElementById('downloadbtn');
downloadbtn.addEventListener('click', () => {
  // var obj = {};
  // obj.student = user;
  window.location.href = `http://localhost:8000/download`;
});

function request(event) {
  event.stopPropagation();
  adminName = getAdminName(event.target.previousElementSibling.innerHTML);
  if (user[0][adminName+'Applied']) {
    alert('You have already requested!');
    return;
  }
  var obj = [];
  obj.push({
    studentEmail: user[0].email,
    adminName: adminName
  });
  window.location.href = `http://localhost:8000/request/${JSON.stringify(obj)}`;
}