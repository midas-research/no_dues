
const CURRENT_URL= JSON.parse(document.getElementById('CURRENT_URL').innerHTML);

var adminName = document.getElementById('adminName').innerHTML;
var id = document.getElementById('id').innerHTML;

var accordion = document.getElementsByClassName('accordion')[0];
var studentList = JSON.parse(document.getElementById('studentList').innerHTML);

function check(student,curr_status){  
  
  if(curr_status=='pending'){    
    return student[adminName+'Applied'] && student[adminName]==null;
  }

  else if(curr_status=='accepted'){    
    return student[adminName]==true;
  }

  else{
    return student[adminName]==false;
  }
}

function addAcceptCode(student,msg){
  
    return `<div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${student.email} - ${student.roll} - ${student.name}</span>
            <span class="icon" aria-hidden="true"></span>
            
        </button>
        <div class="accordion-content">
          <div class="input-group mb-3">
             
            <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2" required>
            <span class="reject_request input-group-append" onclick="sendMessage(event)"> Reject </span>   
            <!--<div class="input-group-append">
                <i class="fas fa-paper-plane send" onclick="sendMessage(event)"></i>
            </div>-->
          </div>
          
          <span class="message">Approved : ${student[adminName+'ApprovedAt']}</span><br>
          <span class="message">Latest Communication before Accepting: </span><br>
          <span class="message">${msg}</span><br>
          <span class="message">Requested : ${student[adminName+'AppliedAt']}</span>
        </div>
      </div>`  
}

function isTrue(student){
  var curr_status=document.getElementById('status').value;
  var curr_degree=document.getElementById('degree').value;
  var curr_department=document.getElementById('department').value;
  var curr_batch=document.getElementById('batch').value;

  var checkDegree= curr_degree==student['degree'];
  var checkDepartment= curr_department==student['department'];
  var checkBatch= curr_batch==student['batch'];

  if(!curr_batch){
    curr_batch=-1;
  } 
  
  if(curr_degree=='All'){
    checkDegree=true;
  }

  if(curr_department=='All'){
    checkDepartment=true;
  }

  if(curr_batch==-1){
    checkBatch=true;
  }

  let res= checkDegree && checkDepartment && checkBatch && check(student,curr_status);

  if(adminName="hostel"){
    var currHostelTaken=document.getElementById('hostelTaken').value;
    if(currHostelTaken=='true'){
      currHostelTaken=true;
    }
    else if(currHostelTaken=='false'){
      currHostelTaken=false;
    }

    console.log(currHostelTaken);
    console.log(student['hostelTaken']);

    var checkHostelTaken=currHostelTaken==student['hostelTaken'];
    console.log(checkHostelTaken);
    
    if(currHostelTaken=='all'){
      checkHostelTaken=true;
    }

    res=res & checkHostelTaken;
  }

  return res;
}

function displayText(student){

  if(adminName=='hostel'){
    var hostelTaken='Hostel Taken';
    if(student.hostelTaken==false){
      hostelTaken='Hostel Not Taken'
    }
    return`<span class="accordion-title"> ${student.email} - ${student.roll} - ${student.name} - ${hostelTaken}</span>`
  }
  return`<span class="accordion-title"> ${student.email} - ${student.roll} - ${student.name}</span>`
}

function clickFilter(){
  var curr_status=document.getElementById('status').value;
  var curr_batch=document.getElementById('batch').value;
  
  if(!curr_batch){
    curr_batch=-1;
  } 

  var currentList=[];

  for(var i in studentList){
      
    if(isTrue(studentList[i])){
      currentList.push(studentList[i]);
    }      
    
  }

  if(curr_status=='accepted'){
    console.log(document.getElementById("selectAll").style.display);
    document.getElementById("selectAll").disabled=true;
    document.getElementById("unselectAll").disabled=true;
    document.getElementById("sendAll").disabled=true;
    
    document.getElementById("selectAll").style.display="none";
    document.getElementById("unselectAll").style.display="none";
    document.getElementById("sendAll").style.display="none";
    
  }
  else{
    document.getElementById("selectAll").disabled=false;
    document.getElementById("unselectAll").disabled=false;
    document.getElementById("sendAll").disabled=false;
      
    document.getElementById("selectAll").style.display="flex";
    document.getElementById("unselectAll").style.display="flex";
    document.getElementById("sendAll").style.display="flex";
  }
  
  if(currentList.length==0){
 
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
    return;
  }
  
 
  accordion.innerHTML = '';
  for (var i in currentList) {

   var message;
   if (currentList[i][adminName+'Message']) {
     message = currentList[i][adminName+'Message'];
   } else {
     message = 'You have not sent any message currently.';
   }

   if(curr_status=='accepted'){
     accordion.innerHTML += addAcceptCode(currentList[i],message);
   }
   else {
     accordion.innerHTML += `
       <div class="accordion-item filter-btech">
         <button id="accordion-button-1" aria-expanded="false">
             ${displayText(currentList[i])}
             <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
             <span class="accept_request" onclick="event.stopPropagation() ;approved(this)"> Accept </span>
             <span class="icon" aria-hidden="true"></span>
         </button>
         <div class="accordion-content">
           <div class="input-group mb-3">             
             <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2" required>
             <span class="reject_request input-group-append" onclick="sendMessage(event)"> Reject </span>   
           </div>
           <span class="message">Latest Communication: </span><br>
           <span class="message">   ${message}</span>
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
}

clickFilter();

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
    id: studentId,
  });
  console.log(JSON.stringify(obj));
  
  window.location.href = `${CURRENT_URL}/approveDues/${JSON.stringify(obj)}`;
  r.remove();
}

var search=document.getElementById('search');
search.addEventListener('click', clickFilter);

var status_button=document.getElementById('status');
status_button.addEventListener('click',clickFilter);


function sendMessage(e) {
  var dues = e.target.previousElementSibling.value;
  if (dues == '') {
    alert("You need to give a message before rejecting!");
    return;
  }
  var message = e.target.parentElement.nextElementSibling;
  message.innerHTML = dues;
  var email = e.target.parentElement.parentElement.previousElementSibling.childNodes[1].textContent;
  var index = email.indexOf(" ");
  var obj = [];
  obj.push({
    admin : adminName,
    message : dues,
    email : email.substring(0, index)
  });
  console.log(JSON.stringify(obj));
  window.location.href = `${CURRENT_URL}/sendMessage/${JSON.stringify(obj)}`;
}

var sheet = document.getElementById('sheet');
sheet.addEventListener('click', () => {
  window.location.href = "/showSheet";
});

// var bankAccountDetails = document.getElementById('bankAccountDetails');
// bankAccountDetails.addEventListener('click', () => {
//   window.location.href = `${CURRENT_URL}/bankAccountDetails`;
// });

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
// console.log(checkboxes.length);
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
    window.location.href = `${CURRENT_URL}/approveManyDues/${JSON.stringify(obj2)}`;
  }
});

var listBoys = document.getElementById('listBoys');
if (listBoys) {
  listBoys.addEventListener('click', () => {
    window.location.href = `${CURRENT_URL}/sendMailToBoysHostelAdmin`;
  });
}

var listGirls = document.getElementById('listGirls');
if (listGirls) {
  listGirls.addEventListener('click', () => {
    window.location.href = `${CURRENT_URL}/sendMailToGirlsHostelAdmin`;
  });
}