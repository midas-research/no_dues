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
  console.log(designLabSymbol.classList);
}
if (user[0].designLab) {
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