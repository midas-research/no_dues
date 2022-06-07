// var professorList = {
//     'scheduler@iiitd.ac.in' : 'Raghava Mutharaju',
// };

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

var reverseProfessorList = {};
var professorList = {};
for (var i in professorsList) {
  professorList[professorsList[i][1]] = professorsList[i][0];
  reverseProfessorList[professorsList[i][0]] = professorsList[i][1];
}

function sendMessageBtp(e) {
    var dues = e.target.parentElement.previousElementSibling.value;
    var message = e.target.parentElement.parentElement.nextElementSibling;
    message.innerHTML = dues;
    var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[1].textContent;
    var index = email.indexOf(" ");
    var obj = [];
    obj.push({
      admin : 'btp',
      message : dues,
      email : email.substring(0, index),
      proffEmail: proffEmail
    });
    console.log(JSON.stringify(obj));
    window.location.href = `http://nodues.fh.iiitd.edu.in/sendMessageBtp/${JSON.stringify(obj)}`;
}

function sendMessageIp(e) {
  var dues = e.target.parentElement.previousElementSibling.value;
  var message = e.target.parentElement.parentElement.nextElementSibling;
  message.innerHTML = dues;
  var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[1].textContent;
  var index = email.indexOf(" ");
  var obj = [];
  obj.push({
    admin : 'ip',
    message : dues,
    email : email.substring(0, index),
    proffEmail: proffEmail
  });
  console.log(JSON.stringify(obj));
  window.location.href = `http://nodues.fh.iiitd.edu.in/sendMessageIp/${JSON.stringify(obj)}`;
}

function btpApproved(e) {
    var r = e.parentElement.parentElement;
    var emailroll = e.parentElement.childNodes[1].innerHTML;
    var email = emailroll.substring(0, emailroll.indexOf(' -'));
    var studentId;
    for (var i in studentList) {
      if (studentList[i]['email'] == email) {
        studentId = studentList[i]['_id'];
      }
    }
    console.log(studentId);
    var obj = [];
    obj.push({
      proffEmail: proffEmail,
      email : email,
      id: studentId
    });
    console.log(JSON.stringify(obj));
    window.location.href = `http://nodues.fh.iiitd.edu.in/btpApproved/${JSON.stringify(obj)}`;
    r.remove();
}

function ipApproved(e) {
    var r = e.parentElement.parentElement;
    var emailroll = e.parentElement.childNodes[1].innerHTML;
    var email = emailroll.substring(0, emailroll.indexOf(' -'));
    var studentId;
    for (var i in studentList) {
      if (studentList[i]['email'] == email) {
        studentId = studentList[i]['_id'];
      }
    }
    console.log(studentId);
    var obj = [];
    obj.push({
      proffEmail: proffEmail,
      email : email,
      id: studentId
    });
    console.log(JSON.stringify(obj));
    window.location.href = `http://nodues.fh.iiitd.edu.in/ipApproved/${JSON.stringify(obj)}`;
    r.remove();
}

var proffEmail = document.getElementById('proffEmail').innerText;
var id = document.getElementById('id').innerText;
var studentList = JSON.parse(document.getElementById('studentList').innerText);
console.log(studentList);

var studentsAll = []
var studentsBtech = []
var studentsMtech = []
var studentsPhd = []
for (var i in studentList) {
    if (!('ipApproved' in studentList[i]) && studentList[i]['ip']==proffEmail) {
        studentsAll.push(studentList[i]);
        if (studentList[i]['degree'] == 'B. Tech') {
            studentsBtech.push(studentList[i]);
        }
        if (studentList[i]['degree'] == 'M. Tech') {
            studentsBtech.push(studentList[i]);
        }
        if (studentList[i]['degree'] == 'PhD') {
            studentsBtech.push(studentList[i]);
        }
    }
    if (studentList[i]['btp']==proffEmail && !('btpApproved' in studentList[i])) {
        studentsAll.push(studentList[i]);
        if (studentList[i]['degree'] == 'B. Tech') {
            studentsBtech.push(studentList[i]);
        }
        if (studentList[i]['degree'] == 'M. Tech') {
            studentsBtech.push(studentList[i]);
        }
        if (studentList[i]['degree'] == 'PhD') {
            studentsBtech.push(studentList[i]);
        }
    }
}
// console.log(studentsAll);
// console.log(studentsBtech);
// console.log(studentsMtech);
// console.log(studentsPhd);

var accordion = document.getElementsByClassName('accordion')[0];
var btpVisited = {};
accordion.innerHTML = "";
for (var i in studentsAll) {
    if (studentsAll[i].email in btpVisited) {
      continue;
    } else {
      btpVisited[studentsAll[i].email] = true;
    }
    console.log('btp', i);
    if (!('btp' in studentsAll[i]) || ('btpApproved' in studentsAll[i])) {
        continue;
    }
    var message;
    if (studentsAll[i]['btpMessage']) {
      message = studentsAll[i]['btpMessage'];
    } else {
      message = 'You have not sent any message currently.';
    }
    if (studentsAll[i]['btp']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsAll[i].email} - ${studentsBtech[i].roll} - BTP</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;btpApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageBtp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
    }
  }

var ipVisited = {};
for (var i in studentsAll) {
    if (studentsAll[i].email in ipVisited) {
      continue;
    } else {
      ipVisited[studentsAll[i].email] = true;
    }
    console.log('btp', i);
    if (!('ip' in studentsAll[i]) || ('ipApproved' in studentsAll[i])) {
        continue;
    }
    var message;
    if (studentsAll[i]['ipMessage']) {
      message = studentsAll[i]['ipMessage'];
    } else {
      message = 'You have not sent any message currently.';
    }
    if (studentsAll[i]['ip']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsAll[i].email} - ${studentsBtech[i].roll} - IP/IS/UR</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;ipApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageIp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
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

var filterBtech = document.getElementsByClassName('filter-btech')[0];
filterBtech.addEventListener('click', () => {
   accordion.innerHTML = '';
   var btpVisited = {};
   for (var i in studentsBtech) {
    if (studentsBtech[i].email in btpVisited) {
      continue;
    } else {
      btpVisited[studentsBtech[i].email] = true;
    }
    if (!('btp' in studentsBtech[i]) || ('btpApproved' in studentsBtech[i])) {
        continue;
    }
    var message;
    if (studentsBtech[i]['btpMessage']) {
        message = studentsBtech[i]['btpMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsBtech[i]['btp']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsBtech[i].email} - ${studentsBtech[i].roll} - BTP</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;btpApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageBtp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
    }
  }
  var ipVisited = {};
  for (var i in studentsBtech) {
    if (studentsBtech[i].email in ipVisited) {
      continue;
    } else {
      ipVisited[studentsBtech[i].email] = true;
    }
    if (!('ip' in studentsBtech[i]) || ('ipApproved' in studentsBtech[i])) {
        continue;
    }
    var message;
    if (studentsBtech[i]['ipMessage']) {
        message = studentsBtech[i]['ipMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsBtech[i]['ip']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsBtech[i].email} - ${studentsBtech[i].roll} - IP/IS/UR</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;ipApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageIp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
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
});

var filterMtech = document.getElementsByClassName('filter-mtech')[0];
filterMtech.addEventListener('click', () => {
  accordion.innerHTML = '';
  var btpVisited = {};
  for (var i in studentsMtech) {
    if (studentsMtech[i].email in btpVisited) {
      continue;
    } else {
      btpVisited[studentsMtech[i].email] = true;
    }
    if (!('btp' in studentsMtech[i]) || ('btpApproved' in studentsMtech[i])) {
        continue;
    }
    var message;
    if (studentsMtech[i]['btpMessage']) {
        message = studentsMtech[i]['btpMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsMtech[i]['btp']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsMtech[i].email} - ${studentsBtech[i].roll} - BTP</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;btpApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageBtp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
    }
  }
  var ipVisited = {};
  for (var i in studentsMtech) {
    if (studentsMtech[i].email in ipVisited) {
      continue;
    } else {
      ipVisited[studentsMtech[i].email] = true;
    }
    if (!('ip' in studentsMtech[i]) || ('ipApproved' in studentsMtech[i])) {
        continue;
    }
    var message;
    if (studentsMtech[i]['ipMessage']) {
        message = studentsMtech[i]['ipMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsMtech[i]['ip']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsMtech[i].email} - ${studentsBtech[i].roll} - IP/IS/UR</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;ipApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageIp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
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
});

var filterPhd = document.getElementsByClassName('filter-phd')[0];
filterPhd.addEventListener('click', () => {
  accordion.innerHTML = '';
  var btpVisited = {};
  for (var i in studentsPhd) {
    if (studentsPhd[i].email in btpVisited) {
      continue;
    } else {
      btpVisited[studentsPhd[i].email] = true;
    }
    if (!('btp' in studentsPhd[i]) || ('btpApproved' in studentsPhd[i])) {
        continue;
    }
    var message;
    if (studentsPhd[i]['btpMessage']) {
        message = studentsPhd[i]['btpMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsPhd[i]['btp']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsPhd[i].email} - ${studentsBtech[i].roll} - BTP</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;btpApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageBtp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
    }
  }
  var ipVisited = {};
  for (var i in studentsPhd) {
    if (studentsPhd[i].email in ipVisited) {
      continue;
    } else {
      ipVisited[studentsPhd[i].email] = true;
    }
    if (!('ip' in studentsPhd[i]) || ('ipApproved' in studentsPh[i])) {
        continue;
    }
    var message;
    if (studentsPhd[i]['ipMessage']) {
        message = studentsPhd[i]['ipMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsPhd[i]['ip']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsPhd[i].email} - ${studentsBtech[i].roll} - IP/IS/UR</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;ipApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageIp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
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
});

var filterAll = document.getElementsByClassName('filter-active')[0];
filterAll.addEventListener('click', () => {
  accordion.innerHTML = '';
  var btpVisited = {};
  for (var i in studentsAll) {
    if (studentsAll[i].email in btpVisited) {
      continue;
    } else {
      btpVisited[studentsAll[i].email] = true;
    }
    if (!('btp' in studentsAll[i]) || ('btpApproved' in studentsAll[i])) {
        continue;
    }
    var message;
    if (studentsAll[i]['btpMessage']) {
        message = studentsAll[i]['btpMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsAll[i]['btp']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsAll[i].email} - ${studentsBtech[i].roll} - BTP</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;btpApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageBtp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
    }
  }
  var ipVisited = {};
  for (var i in studentsAll) {
    if (studentsAll[i].email in ipVisited) {
      continue;
    } else {
      ipVisited[studentsAll[i].email] = true;
    }
    if (!('ip' in studentsAll[i]) || ('ipApproved' in studentsAll[i])) {
        continue;
    }
    var message;
    if (studentsAll[i]['ipMessage']) {
        message = studentsAll[i]['ipMessage'];
      } else {
        message = 'You have not sent any message currently.';
      }
    if (studentsAll[i]['ip']) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentsAll[i].email} - ${studentsBtech[i].roll} - IP/IS/UR</span>
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;ipApproved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessageIp(event)"></i>
              </div>
            </div>
            <span class="message">${message}</span>
          </div>
        </div>`
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
});