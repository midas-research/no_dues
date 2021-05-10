var adminName = document.getElementById('admin').innerHTML;
var studentList = JSON.parse(document.getElementById('studentList').innerHTML);
console.log(adminName);
console.log(studentList);

temp = [];
for (var i in studentList) {
    if (studentList[i][adminName]) {
        temp.push(studentList[i]);
    }
}
console.log(temp);

var accordion = document.getElementsByClassName('accordion')[0];
studentList = temp;
console.log(studentList);

var studentListBtech = [];
var studentListMtech = [];
var studentListPhd = [];
for (var i in studentList) {
  if (studentList[i]['branch'] == 'btech') {
    studentListBtech.push(studentList[i]);
  }
  if (studentList[i]['branch'] == 'mtech') {
    studentListMtech.push(studentList[i]);
  }
  if (studentList[i]['branch'] == 'phd') {
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
    message = 'You have not sent any message.';
  }
  if (studentList[i][adminName]) {
    accordion.innerHTML = "";
    accordion.innerHTML += `
      <div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${studentList[i].email} - 2018104</span>
            <span class="icon" aria-hidden="true"></span>
        </button>
        <div class="accordion-content">
          <span class="message">Approved : ${studentList[i]['updatedAt'].substring(0, 10)} &emsp; ${studentList[i]['updatedAt'].substring(11, 16)}</span><br>
          <span class="message">${message}</span><br>
          <span class="message">Requested : ${studentList[i]['createdAt'].substring(0, 10)} &emsp; ${studentList[i]['createdAt'].substring(11, 16)}</span>
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
    if (studentListBtech[i][adminName]) {
      accordion.innerHTML = '';
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentListBtech[i].email} - 2018104</span>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <span class="message">Approved : ${studentList[i]['updatedAt'].substring(0, 10)} &emsp; ${studentList[i]['updatedAt'].substring(11, 16)}</span><br>
            <span class="message">${message}</span><br>
            <span class="message">Requested : ${studentList[i]['createdAt'].substring(0, 10)} &emsp; ${studentList[i]['createdAt'].substring(11, 16)}</span>
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
    if (studentListMtech[i][adminName]) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentListMtech[i].email} - 2018104</span>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <span class="message">Approved : ${studentList[i]['updatedAt'].substring(0, 10)} &emsp; ${studentList[i]['updatedAt'].substring(11, 16)}</span><br>
            <span class="message">${message}</span><br>
            <span class="message">Requested : ${studentList[i]['createdAt'].substring(0, 10)} &emsp; ${studentList[i]['createdAt'].substring(11, 16)}</span>
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
    if (studentListPhd[i][adminName]) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentListPhd[i].email} - 2018104</span>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <span class="message">Approved : ${studentList[i]['updatedAt'].substring(0, 10)} &emsp; ${studentList[i]['updatedAt'].substring(11, 16)}</span><br>
            <span class="message">${message}</span><br>
            <span class="message">Requested : ${studentList[i]['createdAt'].substring(0, 10)} &emsp; ${studentList[i]['createdAt'].substring(11, 16)}</span>
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
    if (studentList[i][adminName]) {
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${studentList[i].email} - 2018104</span>
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            <span class="message">Approved : ${studentList[i]['updatedAt'].substring(0, 10)} &emsp; ${studentList[i]['updatedAt'].substring(11, 16)}</span><br>
            <span class="message">${message}</span><br>
            <span class="message">Requested : ${studentList[i]['createdAt'].substring(0, 10)} &emsp; ${studentList[i]['createdAt'].substring(11, 16)}</span>
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