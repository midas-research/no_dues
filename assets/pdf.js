var user = document.getElementById('user').innerHTML;
var admins = document.getElementById('admins').innerHTML;

console.log(admins);
console.log(user);

var date = document.getElementById('date');
var today = new Date();
date.innerHTML = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

let doc = new jsPDF('p','pt','a4');
doc.addHTML(document.body,function() {
    doc.save('No-Dues.pdf');
});