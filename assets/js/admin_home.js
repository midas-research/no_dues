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

// var accordion = document.getElementsByClassName('accordion')[0];
// console.log(studentList);
// for (var i=0; i<studentList.length; i++) {
//   console.log(studentList[i]);
//   var accordion_item = document.createElement('div');
//   accordion_item.classList.add('accordion-item');
//   var button = document.createElement('button');
//   button.setAttribute('id', 'accordion-button-1');
//   button.setAttribute('aria-expanded', "false");
//   accordion_item.appendChild(button);
//   var span = document.createElement('span');
//   span.classList.add('accordion-title');
//   span.innerHTML = `${studentList[i].email} - ${studentList[i].roll}`;
//   button.appendChild(span);
//   var i = document.createElement('i');
//   i.setAttribute('class', 'fas fa-check-circle send_request');
//   // i.setAttribute('onclick', `${event.stopPropagation() ;approved(this)}`);
//   // i.addEventListener('click', (e) => {
//   //   e.stopPropagation();
//   //   approved(this)
//   // });
//   button.appendChild(i);
//   var span2 = document.createElement('span');
//   span2.setAttribute('class', 'icon');
//   span2.setAttribute('aria-hidden', 'true');
//   button.appendChild(span2);
//   var accordion_content = document.createElement('div');
//   accordion_content.classList.add('accordion-content');
//   accordion_item.appendChild(accordion_content);
//   var div2 = document.createElement('div');
//   div2.setAttribute('class', 'input-group mb-3');
//   accordion_content.appendChild(div2);
//   var message_input = document.createElement('input');
//   message_input.setAttribute('type', 'text');
//   message_input.setAttribute('class', 'form-control');
//   message_input.setAttribute('placeholder', 'Send a message ...');
//   message_input.setAttribute('aria-label', "Recipient's username");
//   message_input.setAttribute('aria-describedby', 'basic-addon2');
//   div2.appendChild(message_input);
//   var div3 = document.createElement('div');
//   div3.classList.add('input-group-append');
//   div2.appendChild(div3);
//   var send = document.createElement('i');
//   send.setAttribute('class', 'fas fa-paper-plane send');
//   // send.setAttribute('onclick', `${sendMessage(event)}`);
//   // send.addEventListener('click', (e) => {
//   //   sendMessage(e);
//   // });
//   div3.appendChild(send);
//   var message_text = document.createElement('span');
//   message_text.classList.add('message');
//   message_text.innerHTML = 'You have not sent any message currently.';
//   accordion_content.appendChild(message_text);
//   accordion.appendChild(accordion_item);
// }