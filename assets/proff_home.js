var professorsList;
var adminsList;
var studentsList;

const CURRENT_URL= JSON.parse(document.getElementById('CURRENT_URL').innerHTML);

var request = new XMLHttpRequest();
request.open('GET', `${CURRENT_URL}/user/getProfessors`, false);
request.send(null);
if (request.status === 200) {
  professorsList = JSON.parse(request.responseText);
}

var request = new XMLHttpRequest();
request.open('GET', `${CURRENT_URL}/user/getAdmins`, false);
request.send(null);
if (request.status === 200) {
  adminsList = JSON.parse(request.responseText);
}
var request = new XMLHttpRequest();
request.open('GET', `${CURRENT_URL}/user/getStudents`, false);
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
    console.log(e.target.previousElementSibling);
    var dues = e.target.previousElementSibling.value;
    
    if (dues == '' ) {
      alert("You need to give a message before rejecting!");
      return;
    }
    var message = e.target.parentElement.nextElementSibling;
    message.innerHTML = dues;
    var email = e.target.parentElement.parentElement.previousElementSibling.childNodes[1].textContent;
    var index = email.indexOf(" ");
    var obj = [];
    obj.push({
      admin : 'btp',
      message : dues,
      email : email.substring(0, index),
      proffEmail: proffEmail
    });
    console.log(JSON.stringify(obj));
    window.location.href = `${CURRENT_URL}/sendMessageBtp/${JSON.stringify(obj)}`;
}

function sendMessageIp(e) {
  var dues = e.target.previousElementSibling.value;
  if (dues == '' ) {
    alert("You need to give a message before rejecting!");
    return;
  }
  var message = e.target.parentElement.nextElementSibling;
  message.innerHTML = dues;
  var email = e.target.parentElement.parentElement.previousElementSibling.childNodes[1].textContent;
  var index = email.indexOf(" ");
  var obj = [];
  obj.push({
    admin : 'ip',
    message : dues,
    email : email.substring(0, index),
    proffEmail: proffEmail
  });
  console.log(JSON.stringify(obj));
  window.location.href = `${CURRENT_URL}/sendMessageIp/${JSON.stringify(obj)}`;
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
    window.location.href = `${CURRENT_URL}/btpApproved/${JSON.stringify(obj)}`;
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
    window.location.href = `${CURRENT_URL}/ipApproved/${JSON.stringify(obj)}`;
    r.remove();
}

var proffEmail = document.getElementById('proffEmail').innerText;
var id = document.getElementById('id').innerText;
var studentList = JSON.parse(document.getElementById('studentList').innerText);
var accordion = document.getElementsByClassName('accordion')[0];

function check(student,curr_status,curr_type){

  

  if(curr_type=='all'){ 
    if(curr_status=='accepted'){
      return (student['ip']==true) ||(student['btp']==true);
    }  
    else if(curr_status=='rejected'){
      return (student['ipApplied'] && student['ip']==false) ||( student['btpApplied'] && student['btp']==false);
    }  
    return (student['ipApplied'] && student['ip']==null) ||( student['btpApplied'] && student['btp']==null);
  }

  else if(curr_type=='ip'){
    if(curr_status=='accepted'){
      return (student['ip']==true);
    }
    else if(curr_status=='pending'){
      return (student['ip']==null && student['ipApplied']==true);
    }
    return student['ipApplied']==true && student['ip']==false;
  }
  
  else if(curr_type=='btp'){
    if(curr_status=='accepted'){
      return (student['btp']==true);
    }
    else if(curr_status=='pending'){
      return (student['btp']==null && student['btpApplied']==true);
    }
    return student['btpApplied']==true && student['btp']==false;
  }

}

function addIPAcceptCode(student,msg){
  if(student['ip']==null || student['ip']==false){
    return ``;
  }
  
    return `
      <div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - ${student.ipProjectName} - IP/IS/UR</span>
            <span class="icon" aria-hidden="true"></span>
            
        </button>
        <div class="accordion-content">
      
          <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <span class="reject_request input-group-append" onclick="sendMessageIp(event)"> Reject </span>  
          </div>
          <div>
            
            <h5>Description: </h5>
            <ul>
              <li>Project Name: ${student.ipProjectName}</li>
              <li>Project Description: ${student.ipProjectDescription}</li>
            </ul>
            <span class="message">Approved : ${student['ipApprovedAt']}</span><br>
            <span class="message">Latest Communication before Accepting: </span>
            <span class="message">${msg}</span><br>
            <span class="message">Requested : ${student['ipAppliedAt']}</span>
            <br>
          </div>
        </div>
      </div>`  
}

function addBTPAcceptCode(student,msg){
  if(student['btp']==null || student['btp']==false){
    return ``;
  }
  
  return `<div class="accordion-item filter-btech">
      <button id="accordion-button-1" aria-expanded="false">
          <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - ${student.btpProjectName} - BTP</span>
          <span class="icon" aria-hidden="true"></span>
          
      </button>
      <div class="accordion-content">
      
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
          <span class="reject_request input-group-append" onclick="sendMessageBtp(event)"> Reject </span>   
        </div>
        <div>
          <h5>Description: </h5>
          <ul>
            <li>Project Name: ${student.ipProjectName}</li>
            <li>Project Description: ${student.ipProjectDescription}</li>
          </ul>         
          
          <span class="message">Approved : ${student['btpApprovedAt']}</span><br>
          <span class="message">Latest Communication before Accepting: </span>
          <span class="message">${msg}</span><br>
          <span class="message">Requested : ${student['btpAppliedAt']}</span><br>
        </div>
      </div>
    </div>`  
}

function addBTPCode(student,msg,curr_status){
  if(student['btp']==true || !(student['btpApplied']==true)){
    return ``;
  }
  else if(curr_status=='pending' && student['btp']!=null){
    return ``;    
  }
  else if(curr_status=='rejected' && student['btp']==null){
    return ``;
  }
  return ` <div class="accordion-item filter-btech">
            <button id="accordion-button-1" aria-expanded="false">
                <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - ${student.btpProjectName} - BTP</span>
                <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
                <span class="send_request accept_request" onclick="event.stopPropagation() ;btpApproved(this)"> Accept </span>
                <span class="icon" aria-hidden="true"></span>
            </button>
            <div class="accordion-content">
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
                <span class="reject_request input-group-append" onclick="sendMessageBtp(event)"> Reject </span><br> 
                <hr>
              </div>
              <div>
                <h5>Description: </h5>
                <ul>
                  <li>Project Name: ${student.ipProjectName}</li>
                  <li>Project Description: ${student.ipProjectDescription}</li>
                </ul>
              </div>
              <span class="message">Latest Communication: </span>
              <span class="message">${msg}</span>
            </div>
          </div>`
}

function addIPCode(student,msg,curr_status){
  if(student['ip']==true || !(student['ipApplied']==true)){
    return ``;
  }
  else if(curr_status=='pending' && student['ip']!=null){
    return ``;    
  }
  else if(curr_status=='rejected' && student['ip']==null){
    return ``;
  }
  return `<div class="accordion-item filter-btech">
            <button id="accordion-button-1" aria-expanded="false">                
                <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - ${student.ipProjectName} - IP/IS/UR</span>
                <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
                <span class="send_request accept_request" onclick="event.stopPropagation() ;ipApproved(this)"> Accept </span>
                <span class="icon" aria-hidden="true"></span>
            </button>
            <div class="accordion-content">
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
                <span class="reject_request input-group-append" onclick="sendMessageIp(event)"> Reject </span><br><br>
                <hr>
              </div>
              <div>
                <h5>Description: </h5>
                <ul>
                  <li>Project Name: ${student.ipProjectName}</li>
                  <li>Project Description: ${student.ipProjectDescription}</li>
                </ul>
              </div>
              <span class="message">Latest Communication: </span>
              <span class="message">${msg}</span>
            </div>
          </div>`
}

function isTrue(student){
  var curr_status=document.getElementById('status').value;
  var curr_type=document.getElementById('ip/btp').value;

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

  return checkDegree && checkDepartment && checkBatch && check(student,curr_status,curr_type);
}

function clickFilter(){  

  var currentList=[];

  for(var i in studentList){      
    if(isTrue(studentList[i])){
      currentList.push(studentList[i]);
    }          
  }
  // console.log(currentList);
  

  var curr_status=document.getElementById('status').value;
  var curr_type=document.getElementById('ip/btp').value;
  
  if(currentList.length==0){
 
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
    return;
  }
  
  if(curr_status=='accepted'){
    document.getElementById("selectAll").display=true;
    document.getElementById("unselectAll").disabled=true;
    document.getElementById("sendAll").disabled=true;
    // document.getElementById("selectAll").style.opacity=0.5;
    // document.getElementById("unselectAll").style.opacity=0.5;
    // document.getElementById("sendAll").style.opacity=0.5;
  }
  else{
    document.getElementById("selectAll").disabled=false;
    document.getElementById("unselectAll").disabled=false;
    document.getElementById("sendAll").disabled=false;
    // document.getElementById("selectAll").style.opacity=1;
    // document.getElementById("unselectAll").style.opacity=1;
    // document.getElementById("sendAll").style.opacity=1;
  }

  accordion.innerHTML = '';


  for (var i in currentList) {

    var ipmessage;
    if (currentList[i]['ipMessage']) {
      ipmessage = currentList[i]['ipMessage'];
    } else {
      ipmessage = 'You have not sent any message currently.';
    }

    var btpmessage;
    if (currentList[i]['btpMessage']) {
      btpmessage = currentList[i]['btpMessage'];
    } else {
      btpmessage = 'You have not sent any message currently.';
    }

    // console.log(curr_status);

    if(curr_status=='accepted'){
      if(curr_type=='ip'){
        accordion.innerHTML += addIPAcceptCode(currentList[i],ipmessage);
      }

      if(curr_type=='btp'){
        accordion.innerHTML += addBTPAcceptCode(currentList[i],btpmessage);
      }

      if(curr_type=='all'){
        
        accordion.innerHTML += addIPAcceptCode(currentList[i],ipmessage);
        accordion.innerHTML += addBTPAcceptCode(currentList[i],btpmessage);
      }
      
    }
    else {
        // console.log(curr_type);
        if(curr_type=='ip'){
          accordion.innerHTML += addIPCode(currentList[i],ipmessage,curr_status);
        }

        if(curr_type=='btp'){
          accordion.innerHTML += addBTPCode(currentList[i],btpmessage,curr_status);
        }

        if(curr_type=='all'){
          
          accordion.innerHTML += addIPCode(currentList[i],ipmessage,curr_status);
          accordion.innerHTML += addBTPCode(currentList[i],btpmessage,curr_status);
        }
          
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

var search=document.getElementById('search');
search.addEventListener('click', clickFilter);


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

sendAll.addEventListener('click', () => {
  var obj = [];
  for (var i in checkboxes) {    
    if (checkboxes[i].checked == true) {
      if (checkboxes[i].previousElementSibling) {
        var text = checkboxes[i].previousElementSibling.innerHTML;
        var list=text.split(" ");
       
        var studentEmail = list[0];       
        
        var admin=list[list.length-1];
        if(admin=='BTP'){
          admin='btp';
        }
        else{
          admin='ip';
        }
        obj.push({
          proffEmail: proffEmail,
          studentEmail : studentEmail,
          admin :admin
        });
        console.log(obj);
      }
    }
  }
  if (obj.length != 0) {
    var obj2 = []; obj2.push(obj);
    console.log(obj);
    window.location.href = `${CURRENT_URL}/approveManyProffs/${JSON.stringify(obj2)}`;
  }
});

