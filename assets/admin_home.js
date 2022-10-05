var adminName = document.getElementById('adminName').innerHTML;
var id = document.getElementById('id').innerHTML;
console.log(adminName);
console.log(id);

var accordion = document.getElementsByClassName('accordion')[0];
var studentList = JSON.parse(document.getElementById('studentList').innerHTML);
console.log(studentList);

var studentListBtech = [];
var studentListMtech = [];
var studentListPhd = [];
for (var i in studentList) {
  if (studentList[i]['degree'] == 'B. Tech') {
    studentListBtech.push(studentList[i]);
  }
  if (studentList[i]['degree'] == 'M. Tech') {
    studentListMtech.push(studentList[i]);
  }
  if (studentList[i]['degree'] == 'PhD') {
    studentListPhd.push(studentList[i]);
  }
}
console.log(studentListBtech);
console.log(studentListMtech);
console.log(studentListPhd);
// console.log(studentList);
// console.log(typeof(studentList));
for (var i in studentList) {
  var message;
  if (studentList[i][adminName+'Message']) {
    message = studentList[i][adminName+'Message'];
  } else {
    message = 'You have not sent any message currently.';
  }
  if (studentList[i][adminName+'Applied'] && !studentList[i][adminName]) {
    accordion.innerHTML = "";
    accordion.innerHTML += `
      <div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${studentList[i].email} - ${studentList[i].roll}</span>
            <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this)"></i>
            <span class="icon" aria-hidden="true"></span>
        </button>
        <div class="accordion-content">
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
            <div class="input-group-append">
                <i class="fas fa-paper-plane send" onclick="sendMessage(event)"></i>
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

function approved(e) {
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
    admin : adminName,
    email : email,
    id: studentId
  });
  console.log(JSON.stringify(obj));
  window.location.href = `http://localhost:8000/approveDues/${JSON.stringify(obj)}`;
  r.remove();
}

var all = document.getElementsByClassName('filter-active')[0];
var current = all;

var btech = document.getElementsByClassName('filter-btech')[0];
var mtech = document.getElementsByClassName('filter-mtech')[0];
var phd = document.getElementsByClassName('filter-phd')[0];
btech.addEventListener('click', () => {
  btech.classList.add('filter-active');
  current.classList.remove('filter-active');
  current = btech;
});
mtech.addEventListener('click', () => {
  mtech.classList.add('filter-active');
  current.classList.remove('filter-active');
  current = mtech;
});
phd.addEventListener('click', () => {
  phd.classList.add('filter-active');
  current.classList.remove('filter-active');
  current = phd;
});
all.addEventListener('click', () => {
  all.classList.add('filter-active');
  current.classList.remove('filter-active');
  current = all;
});

function sendMessage(e) {
  var dues = e.target.parentElement.previousElementSibling.value;
  if (dues == '') {
    return;
  }
  var message = e.target.parentElement.parentElement.nextElementSibling;
  message.innerHTML = dues;
  var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[1].textContent;
  var index = email.indexOf(" ");
  var obj = [];
  obj.push({
    admin : adminName,
    message : dues,
    email : email.substring(0, index)
  });
  console.log(JSON.stringify(obj));
  window.location.href = `http://localhost:8000/sendMessage/${JSON.stringify(obj)}`;
}

var filterBtech = document.getElementsByClassName('filter-btech')[0];
filterBtech.addEventListener('click', () => {
   accordion.innerHTML = '';
   for (var i in studentListBtech) {
    var message;
    if (studentListBtech[i][adminName+'Message']) {
      message = studentListBtech[i][adminName+'Message'];
    } else {
      message = 'You have not sent any message currently.';
    }
    if (studentList[i][adminName+'Applied'] && !studentList[i][adminName]) {
      accordion.innerHTML = '';
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentListBtech[i].email} - ${studentListBtech[i].roll}</span>
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessage(event)"></i>
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
  for (var i in studentListMtech) {
    var message;
    if (studentListMtech[i][adminName+'Message']) {
      message = studentListMtech[i][adminName+'Message'];
    } else {
      message = 'You have not sent any message currently.';
    }
    if (studentList[i][adminName+'Applied'] && !studentList[i][adminName]) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentListMtech[i].email} - ${studentListMtech[i].roll}</span>
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessage(event)"></i>
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
  for (var i in studentListPhd) {
    var message;
    if (studentListPhd[i][adminName+'Message']) {
      message = studentListPhd[i][adminName+'Message'];
    } else {
      message = 'You have not sent any message currently.';
    }
    if (studentList[i][adminName+'Applied'] && !studentList[i][adminName]) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentListPhd[i].email} - ${studentListPhd[i].roll}</span>
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessage(event)"></i>
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
  for (var i in studentList) {
    var message;
    if (studentList[i][adminName+'Message']) {
      message = studentList[i][adminName+'Message'];
    } else {
      message = 'You have not sent any message currently.';
    }
    if (studentList[i][adminName+'Applied'] && !studentList[i][adminName]) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentList[i].email} - ${studentList[i].roll}</span>
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
              <i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this)"></i>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessage(event)"></i>
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

var past = document.getElementById('past');
past.addEventListener('click', () => {
  var obj = [];
  obj.push({
    admin : adminName,
  });
  console.log(JSON.stringify(obj));
  window.location.href = `http://localhost:8000/past/${JSON.stringify(obj)}`;
});

var sheet = document.getElementById('sheet');
sheet.addEventListener('click', () => {
  window.location.href = "http://localhost:8000/showSheet";
});

var bankAccountDetails = document.getElementById('bankAccountDetails');
bankAccountDetails.addEventListener('click', () => {
  window.location.href = "http://localhost:8000/bankAccountDetails";
});

//code for selecting multiple students at a time
var selectAll = document.getElementById('selectAll');
var checkboxes = document.getElementsByClassName('tickbox');
selectAll.addEventListener('click', () => {
  for (var i in checkboxes) {
    checkboxes[i].checked = true;
  }
});
var unselectAll = document.getElementById('unselectAll');
var checkboxes = document.getElementsByClassName('tickbox');
unselectAll.addEventListener('click', () => {
  for (var i in checkboxes) {
    checkboxes[i].checked = false;
  }
});

//code for sending multiple students at a time
var sendAll = document.getElementById('sendAll');
var checkboxes = document.getElementsByClassName('tickbox');
console.log(checkboxes.length);
sendAll.addEventListener('click', () => {
  var obj = [];
  for (var i in checkboxes) {
    //sendRequestButtons[i].click();
    if (checkboxes[i].checked == true) {
      if (checkboxes[i].previousElementSibling) {
        var text = checkboxes[i].previousElementSibling.innerHTML;
        var index = text.indexOf(' ');
        var studentEmail = text.substring(0,index);
        obj.push({
          studentEmail: studentEmail,
          adminName: adminName
        });
      }
    }
  }
  if (obj.length != 0) {
    var obj2 = []; obj2.push(obj);
    console.log(obj);
    window.location.href = `http://localhost:8000/approveManyDues/${JSON.stringify(obj2)}`;
  }
});

var listBoys = document.getElementById('listBoys');
if (listBoys) {
  listBoys.addEventListener('click', () => {
    window.location.href = "http://localhost:8000/sendMailToBoysHostelAdmin";
  });
}

var listGirls = document.getElementById('listGirls');
if (listGirls) {
  listGirls.addEventListener('click', () => {
    window.location.href = "http://localhost:8000/sendMailToGirlsHostelAdmin";
  });
}