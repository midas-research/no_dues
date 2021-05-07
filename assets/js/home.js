const items = document.querySelectorAll(".accordion button");

const user = JSON.parse(document.getElementById('user').innerHTML);
console.log(user);

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

var designLabMessage = document.getElementById('designLabMessage');
if (user[0].designLabMessage) {
  designLabMessage.innerHTML = user[0].designLabMessage;
  var designLabSymbol = document.getElementsByClassName('designLabSymbol')[0];
  if (designLabSymbol.classList.contains('fa-spinner')) {
    designLabSymbol.classList.remove('fa-spinner');
    designLabSymbol.classList.add('fa-times-circle');
  }
}
if (user[0].designLab) {
  var designLabSymbol = document.getElementsByClassName('designLabSymbol')[0];
  if (designLabSymbol.classList.contains('fa-spinner')) {
    designLabSymbol.classList.remove('fa-spinner');
    designLabSymbol.classList.add('fa-check-circle');
  }
  if (designLabSymbol.classList.contains('fa-times-circle')) {
    designLabSymbol.classList.remove('fa-times-circle');
    designLabSymbol.classList.add('fa-check-circle');
  }
  designLabMessage.innerHTML = 'Your dues for this department is approved.';
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
  var obj = {};
  obj.student = user;
  window.location.href = `http://localhost:8000/download/${JSON.stringify(obj)}`;
})