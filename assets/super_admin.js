// console.log("Inside super admin Js")
const CURRENT_URL= JSON.parse(document.getElementById('CURRENT_URL').innerHTML);

var adminList = JSON.parse(document.getElementById('adminList').innerHTML);
// console.log(adminList);
var id = document.getElementById('id').innerHTML;
var adminName= document.getElementById('adminName').innerHTML;



var accordion = document.getElementsByClassName('accordion')[0];
var studentList = JSON.parse(document.getElementById('studentList').innerHTML);

function check(student,curr_status){
  
  if(curr_status=='pending'){    
    return student[adminName]==null;
  }

  else if(curr_status=='accepted'){
    return student[adminName]==true;
  }

  else{
    return student[adminName]==false;
  }
}
function adminsLeft(student){

  var check=true;

  for(var i in adminList){
    if(!student[adminList[i]]){
      check&=false;
    }
    else{
      check&=student[adminList[i]];
    }    

  }

  return check;

  

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
          </div>


          
          <span class="message">Approved : ${student[adminName+'ApprovedAt']}</span><br>
          <span class="message">Latest Communication before Accepting: </span><br>
          <span class="message">${msg}</span><br>
          <span class="message">Requested : ${student[adminName+'AppliedAt']}</span>
          <hr>
          <div class="admins-status">
              ${addcontent(student)} 
          </div>

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

  return checkDegree && checkDepartment && checkBatch && check(student,curr_status);


}

function addcontent(student){
    uncleared=`<hr><h5>UnCleared Status: </h5>
              <ul>`;
    cleared=`<h5>Cleared Status: </h5> 
            <ul>`;
    for (var i in adminList){
      var j=student[adminList[i]];
      if(j==null){
        j=false;        
      }
      if(j==true){
        cleared+=`<li> ${adminList[i]} : ${j} </li>`;
      }
      else{
        uncleared+=`<li> ${adminList[i]} : ${j} </li>`;
      }
      
    }
    uncleared+=`</ul>`;
    cleared+=`</ul>`;
    return cleared+uncleared;
}

function clickFilter(){

  var curr_status=document.getElementById('status').value;
  var curr_degree=document.getElementById('degree').value;
  var curr_department=document.getElementById('department').value;
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
  
  if(currentList.length==0){ 
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
    return;
  }
  
  if(curr_status=='accepted'){ 
    document.getElementById("selectAll").disabled=true;
    document.getElementById("unselectAll").disabled=true;
    document.getElementById("sendAll").disabled=true;
  }
  else{
    document.getElementById("selectAll").disabled=false;
    document.getElementById("unselectAll").disabled=false;
    document.getElementById("sendAll").disabled=false;
  }
  accordion.innerHTML = '';

  for (var i in currentList) {
   var message;
   if (currentList[i][adminName+'Message']) {
     message = currentList[i][adminName+'Message'];
   } else {
     message = 'You have not sent any message currently.';
   }

   if(check(currentList[i],curr_status) && curr_status=='accepted'){
     accordion.innerHTML = "";
     accordion.innerHTML += addAcceptCode(currentList[i],message);
   }
   else if (check(currentList[i],curr_status)) {

     k="Not Cleared"
     if(adminsLeft(currentList[i])){
        k="All Cleared"
     }
     accordion.innerHTML = '';
     accordion.innerHTML += `
       <div class="accordion-item filter-btech">
         <button id="accordion-button-1" aria-expanded="false">
             <span class="accordion-title">${currentList[i].email} - ${currentList[i].roll} - ${currentList[i].name} - ${k}</span>
             <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
             <span class="accept_request" onclick="event.stopPropagation() ;approved(this)"> Accept </span>
             <!--<i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this)"></i>-->
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
           <span class="message">Latest Communication: </span><br>
           <span class="message">   ${message}</span>
           <hr>
           <div class="admins-status">
              ${addcontent(currentList[i])} 
            </div>
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

  console.log(adminName);
 
  var obj = [];
  obj.push({
    admin : adminName,
    email : email,
    id: studentId
  });
  console.log(JSON.stringify(obj));
  
  
  window.location.href = `${CURRENT_URL}/superApproveDues/${JSON.stringify(obj)}`;
  r.remove();
}

var search=document.getElementById('search');
search.addEventListener('click', clickFilter);


function sendMessage(e, res) {
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
  window.location.href = `${CURRENT_URL}/superSendMessage/${JSON.stringify(obj)}`;
}

var sheet = document.getElementById('sheet');
sheet.addEventListener('click', () => {
  window.location.href = `${CURRENT_URL}/showSheet`;
});

var adminRequests  = document.getElementById('adminRequests');
adminRequests.addEventListener('click', () => {
  window.location.href = `${CURRENT_URL}/super_admin/adminRequests`;
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
    window.location.href = `${CURRENT_URL}/superApproveManyDues/${JSON.stringify(obj2)}`;
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