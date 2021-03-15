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
  var message = e.target.parentElement.parentElement.nextElementSibling;
  message.innerHTML = dues;
}

studentList = [{
  'name' : 'Soumyadeep Paul',
  'email' : 'soumyadeep18104@iiitd.ac.in',
  'roll' : '2018104'
}, {
  'name' : 'Yashdeep Prasad',
  'email' : 'yashdeep18121@iiitd.ac.in',
  'roll' : '2018121'
}, {
  'name' : 'Himanshu Aggarwal',
  'email' : 'himanshu18146@iiitd.ac.in',
  'roll' : '2018146'
}, {
  'name' : 'Vishwesh',
  'email' : 'vishwesh18084@iiitd.ac.in',
  'roll' : '2018084'
}];

for (var i=0; i<studentList.length; i++) {
  
}