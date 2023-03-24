const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
var adminList = JSON.parse(document.getElementById("adminList").innerHTML);
var id = document.getElementById("id").innerHTML;
var adminName = document.getElementById("adminName").innerHTML;
var accordion = document.getElementsByClassName("accordion")[0];
var originalName = JSON.parse(
  document.getElementById("originalName").innerHTML
);
var studentList;
var addAdmins = document.getElementById("admins");

//Adding Options to Choose Admin Filter
function format(text) {
  let arr = text.split(" ");
  var name = "";
  for (var i in arr) {
    if (arr[i] == "&amp;") {
      name += "& ";
    } else {
      name += arr[i] + " ";
    }
  }
  return name;
}

for (var i in adminList) {
  var option = document.createElement("option");
  option.value = adminList[i];
  option.text = format(originalName[adminList[i]]);
  addAdmins.add(option);
}

var option = document.createElement("option");
option.value = "professor";
option.text = "Professor";
addAdmins.add(option);

addAdmins.addEventListener('click',applyStatus);

//html Code For Accepted Requests
function addAcceptCode(student, msg, curr_admin) {
  return `<div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">
            
            <div class="col-1 text-center">
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            </div>

            <div class="accordion-title col-8">${displayCustomText(student)}</div>

            <!--Accept-->

            <div class="col-1 text-center"> 
            </div>
            
            <!--Reject-->
            <div class="col-1 text-center"> 
               <i class="bi bi-x-circle"  style="color:  #dc3545;" onclick="clickAlternate(event)" data-toggle="tooltip" data-placement="bottom" title="Reject"></i>
            </div>
            
            <div class="col-1 text-center">     
              <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
              <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
            </div>    
      </button>

      <div class="accordion-content ">
          <div class="accordion-body">
            <form class="custom-form mx-auto">
              <label>Message: </label>
              <input class="mt-2 form-control message" type="text" placeholder="Send a message ...">
              <label>Fine:  </label>
              <input type="number" class="mt-2 form-control" placeholder="Fine..." >
              <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessage(event)" > Reject</button>
            </form>  
            <hr class="mt-2 mb-2">
            <span class="message">Latest Communication: </span><br>
            <span class="message">${msg}</span>          
          </div>          
      </div>
    </div>`;
}

function isTrue(student) {
  
  var curr_degree = document.getElementById("degree").value;
  var curr_department = document.getElementById("department").value;
  var curr_batch = document.getElementById("batch").value;
  

  var checkDegree = curr_degree == student["degree"];
  var checkDepartment = curr_department == student["department"];
  var checkBatch = curr_batch == student["batch"];

  if (!curr_batch) {
    curr_batch = -1;
  }

  if (curr_degree == "All") {
    checkDegree = true;
  }

  if (curr_department == "All") {
    checkDepartment = true;
  }

  if (curr_batch == -1) {
    checkBatch = true;
  }

  return (
    checkDegree &&
    checkDepartment &&
    checkBatch    
  );
}

function displayCustomText(student) {
  var curr_admin = document.getElementById("admins").value; 
  if (curr_admin == "hostel") {
    var hostelTaken = "Hostel Taken";
    if (student.hostelTaken == false) {
      hostelTaken = "Hostel Not Taken";
    }
    return `${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${hostelTaken}</span>`;
  }
  return `${student.email} - ${student.roll} - ${student.name}`;
}

function clickAdminFilter() {
  var curr_admin = document.getElementById("admins").value;  

  let curr_status = document.getElementsByClassName("status")[0].id;

  //Filtering and adding students to currentList
  var currentList = [];
  for (var i in studentList) {
    if (isTrue(studentList[i])) {
      currentList.push(studentList[i]);
    }
  }

  //Enabling/Disabling according to filter options
  if (curr_status == "accepted") {
    document.getElementById("selectAll").disabled = true;
    document.getElementById("unselectAll").disabled = true;
    document.getElementById("sendAll").disabled = true;
  } else {
    document.getElementById("selectAll").disabled = false;
    document.getElementById("unselectAll").disabled = false;
    document.getElementById("sendAll").disabled = false;
  }

  //if there are no requests
  if (currentList.length == 0) {
    accordion.innerHTML = `<div class="alert alert-dark mx-3" role="alert">No Requests Found</div>`;
    return;
  }

  accordion.innerHTML = "";

  //Adding requests if any
  for (var i in currentList) {
    //Setting message to be displayed for each request
    var message;
    if (currentList[i][curr_admin + "Message"]) {
      message = currentList[i][curr_admin + "Message"];
    } else {
      message = "You have not sent any message currently.";
    }

     if (currentList[i][adminName + "Fine"]!=0) {
       message += `<br> Fine: Rs. ${currentList[i][curr_admin + "Fine"]} `;
     } else {
       message += `<br> Fine: NA`;
     }

    if (curr_status == "accepted") {
      //html code for accepted filter
      accordion.innerHTML += addAcceptCode(currentList[i], message, curr_admin);
    } else {
      //html code for pending/rejected filter
      accordion.innerHTML += `
      <div class="accordion-item container">
        <button class="row accordion-heading" type="button" aria-expanded="false">

              <div class="col-1 text-center">
                <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
              </div>

              <div class="accordion-title col-8">${displayCustomText(currentList[i])}</div>

              <!--Accept-->

              <div class="col-1 text-center"> 
                <i class="bi bi-check-circle" style="color:  #198754;" onclick="event.stopPropagation() ;approved(this)" data-toggle="tooltip" data-placement="bottom" title="Accept"></i>
              </div>
              
              <!--Reject-->
              <div class="col-1 text-center"> 
                <i class="bi bi-x-circle"  style="color:  #dc3545;" onclick="clickAlternate(event)" data-toggle="tooltip" data-placement="bottom" title="Reject"></i>
              </div>
              
              <div class="col-1 text-center">     
                <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
                <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
              </div>      
            
        </button>
        <div class="accordion-content ">

            <div class="accordion-body">
              <form class="custom-form mx-auto">
                <label>Message: </label>
                <input class="mt-2 form-control message" type="text" placeholder="Send a message ...">
                <label>Fine:  </label>
                <input type="number" class="mt-2 form-control" placeholder="Fine..." >
                <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessage(event,'${curr_admin}')" > Reject</button>
              </form>            

              <hr class="mt-2 mb-2">

              <span class="message">Latest Communication: </span><br>
              <span class="message">${message}</span>
            
            </div>
            
        </div>
      </div>`;
    }
  }

  //adding functionality to accordion buttons
  const items = document.querySelectorAll(".accordion button");

  function toggleAccordion() {
    const itemToggle = this.getAttribute("aria-expanded");
    for (i = 0; i < items.length; i++) {
      items[i].setAttribute("aria-expanded", "false");
    }
    if (itemToggle == "false") {
      this.setAttribute("aria-expanded", "true");
    }
  }
  items.forEach((item) => item.addEventListener("click", toggleAccordion));
}

//getting Requests according to Admin
function applyStatusAdmin() {
  var curr_admin = document.getElementById("admins").value;
  var curr_status = document.getElementsByClassName("status")[0].id; 


  document.getElementById("profFilter").style.display = "none";
  document.getElementById("ip/btp").style.display = "none";

  //Getting list of students
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${curr_admin}/${curr_status}`, false);
  request.send();
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
    
    //applying filter
    clickAdminFilter();
  }

  
}

//Accepting a Request
function approved(e) { 
  var curr_admin = document.getElementById("admins").value;
  var emailroll = e.parentElement.previousElementSibling.innerHTML;
  var email = emailroll.substring(0, emailroll.indexOf(" -"));
  
  var studentId;
  for (var i in studentList) {
    if (studentList[i]["email"] == email) {
      studentId = studentList[i]["_id"];
    }
  }
  var obj = [];
  obj.push({
    admin: curr_admin,
    email: email,
    id: studentId
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/approveDues/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);
  applyStatus();
}

//Rejecting a Request
function sendMessage(e) {
  var curr_admin = document.getElementById("admins").value;
  var fine = e.target.previousElementSibling.value;
  var dues = e.target.previousElementSibling.previousElementSibling.previousElementSibling.value;
  
  if (dues == "") {
    alert("You need to give a message before rejecting!");
    return;
  }

  var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[3].innerHTML;
 
  var index = email.indexOf(" -");
  email = email.substring(0, index);  

  var obj = [];
  obj.push({
    admin: curr_admin,
    message: dues,
    fine: fine,
    email: email,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/sendMessage/${JSON.stringify(obj)}`,
    false
  );
  request.send();

  applyStatus();
}

//Functionality of reject button in accordion button
function clickAlternateAdmin(e){  
  let element=e.target.parentElement.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].childNodes[9];
  element.click();
}

//Whenever status_button is selected, filter requests
var pending = document.getElementById("pending");
var rejected = document.getElementById("rejected");
var accepted = document.getElementById("accepted");

pending.addEventListener("click", function(){
  pending.classList.add('status');
  rejected.classList.remove('status');
  accepted.classList.remove('status');
  applyStatus();
});

rejected.addEventListener("click", function () {
  pending.classList.remove("status");
  rejected.classList.add("status");
  accepted.classList.remove("status");
  applyStatus();
});

accepted.addEventListener("click", function () {
  pending.classList.remove("status");
  rejected.classList.remove("status");
  accepted.classList.add("status");
  applyStatus();
});


//Whenever search is selected, filter requests
const filters = document.querySelectorAll(".filter");
filters.forEach(function (btn) {
  btn.addEventListener("click",function(){
    var curr_admin = document.getElementById("admins").value;
    if(curr_admin=='professor'){
      clickProfFilter();
    }
    else{
      clickAdminFilter();
    }
  });
});

document.getElementById('batchButton').addEventListener('click',function(){
  var curr_admin = document.getElementById("admins").value;
  if(curr_admin=='professor'){
    clickProfFilter();
  }
  else{
    clickAdminFilter();
  }
});

//Sheet Functionality
var sheet = document.getElementById("sheet");
sheet.addEventListener("click", () => {
  new Noty({
    theme: "metroui",
    text: "Updating Sheet!",
    type: "success",
    layout: "topRight",
    timeout: 1500,
  }).show();
  window.open(`${CURRENT_URL}/showSheet`, "_blank");
  
});


//code for selecting multiple students at a time
var selectAll = document.getElementById("selectAll");
selectAll.addEventListener("click", () => {
  var checkboxes = document.getElementsByClassName("tickbox");
  for (var i in checkboxes) {
    checkboxes[i].checked = true;
  }
});

//code for unselecting students at a time
var unselectAll = document.getElementById("unselectAll");
unselectAll.addEventListener("click", () => {
 
  var checkboxes = document.getElementsByClassName("tickbox");
 
  for (var i in checkboxes) {
    checkboxes[i].checked = false;
  }
});

//Approving Multiple Admin Requests
function sendSelectedAdmin() {
  var curr_admin = document.getElementById("admins").value;
  var checkboxes = document.getElementsByClassName("tickbox");
  var obj = [];

  for (var i in checkboxes) {
    
    if (checkboxes[i].checked == true) {
      if(checkboxes[i].nextSibling){
        var text = checkboxes[i].parentElement.nextElementSibling.innerHTML;

        var index = text.indexOf(" -");
        var studentEmail = text.substring(0, index);

        obj.push({
          studentEmail: studentEmail,
          adminName: curr_admin,
        });  
      }         
          
    }
  }
  if (obj.length != 0) {
    var obj2 = [];
    obj2.push(obj);
    var request = new XMLHttpRequest();
    request.open(
      "GET",
      `${CURRENT_URL}/approveManyDues/${JSON.stringify(obj2)}`,
      false
    );
    request.send(null);

    applyStatus();
  }



  
}

//code for sending multiple students at a time
var sendAll = document.getElementById("sendAll");
sendAll.addEventListener("click", function(){
  var curr_admin = document.getElementById("admins").value;
  if(curr_admin=='professor'){
    sendSelectedProf();
  }
  else{
    sendSelectedAdmin();
  }
});

//Professor Functions

var profButton = document.getElementById("profFilter");
profButton.addEventListener("click", applyStatusProfessor);

let professorsList = [];

var request = new XMLHttpRequest();
request.open("GET", `${CURRENT_URL}/user/getProfessors`, false);
request.send(null);
if (request.status === 200) {
  professorsList = JSON.parse(request.responseText);
}

let profFilter = document.getElementById(`profFilter`);
for (var i in professorsList) {
  var newOption = document.createElement("option");
  var optionText = document.createTextNode(
    `${professorsList[i][0]} (${professorsList[i][1]})`
  );
  newOption.appendChild(optionText);
  newOption.setAttribute("value", professorsList[i][1]);
  profFilter.appendChild(newOption);
}

//Approving and Rejecting BTP / IP
function sendMessageBtp(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
  var dues = e.target.previousElementSibling.value;

  if (dues == "") {
    alert("You need to give a message before rejecting!");
    return;
  }
  
  var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[3].innerHTML;
  var index = email.indexOf(" ");
  var obj = [];
  obj.push({
    admin: "btp",
    message: dues,
    email: email.substring(0, index),
    idx: idx,
    profEmail: profEmail,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/sendMessageBtp/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);

  applyStatus();
}

function sendMessageIp(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
  var dues = e.target.previousElementSibling.value;

  if (dues == "") {
    alert("You need to give a message before rejecting!");
    return;
  }  
  var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[3].innerHTML;
  var index = email.indexOf(" ");
  var obj = [];
  obj.push({
    admin: "ip",
    message: dues,
    idx: idx,
    email: email.substring(0, index),
    profEmail: profEmail,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/sendMessageIp/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);

  applyStatus();
}

function btpApproved(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
  var emailroll = e.parentElement.previousElementSibling.innerHTML;
  var email = emailroll.substring(0, emailroll.indexOf(" -"));

  var obj = [];
  obj.push({
    profEmail: profEmail,
    email: email,
    idx: idx,
  });
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/btpApproved/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);

  applyStatus();
}

function ipApproved(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
  var emailroll = e.parentElement.previousElementSibling.innerHTML;
  var email = emailroll.substring(0, emailroll.indexOf(" -"));

  var obj = [];
  obj.push({
    profEmail: profEmail,
    email: email,
    idx: idx,
  });
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/ipApproved/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);

  applyStatus();
}

function clickAlternateProf(e){  
  let element=e.target.parentElement.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].childNodes[5];
  element.click();
}

//Code To Create Components

function addAcceptIPCode(student, obj, msg, idx) {
  return `
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">

        <div class="col-1 text-center">
          <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
        </div>

        <div class="accordion-title col-8">${student.email} - ${student.roll} - ${student.name} <span class="tag tag-primary">${obj.projectName}</span> <span class="tag tag-secondary">IP/IS/UR</span></div>

        <!--Accept-->

        <div class="col-1 text-center"> </div>
        
        <!--Reject-->
        <div class="col-1 text-center"> 
            <i class="bi bi-x-circle"  style="color:  #dc3545;" onclick="clickAlternate(event)" data-toggle="tooltip" data-placement="bottom" title="Reject"></i>
        </div>    
          
      </button>
      <div class="accordion-content ">

          <div class="accordion-body">

            <form class="custom-form mx-auto">
              <label>Message: </label>
              <input class="mt-2 form-control message" type="text" placeholder="Send a message ...">
              <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessageIp(event,${idx})" > Reject</button>
            </form> 
            

            <div>
              <p>Description: </p>
              <ul>
                <li>Project Name: ${obj.projectName}</li>
                <li>Project Description: ${obj.projectDescription}</li>
              </ul>
            </div>
      
            <span class="message">Latest Communication: </span><br>
            <span class="message">${msg}</span>
          
          </div>
          
      </div>
    </div>`;
}

function addAcceptBTPCode(student, obj, msg, idx) {
  return `
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">
            <div class="col-1 text-center">
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            </div>

            <div class="accordion-title col-8">${student.email} - ${student.roll} - ${student.name} <span class="tag tag-primary">${obj.projectName}</span> <span class="tag tag-secondary">BTP</span></div>

            <!--Accept-->

            <div class="col-1 text-center">               
            </div>
            
            <!--Reject-->
            <div class="col-1 text-center"> 
               <i class="bi bi-x-circle"  style="color:  #dc3545;" onclick="clickAlternate(event)" data-toggle="tooltip" data-placement="bottom" title="Reject"></i>
            </div>    
          
      </button>
      <div class="accordion-content ">

          <div class="accordion-body">

            <form class="custom-form mx-auto">
              <label>Message: </label>
              <input class="mt-2 form-control message" type="text" placeholder="Send a message ...">
              <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessageBtp(event,${idx})" > Reject</button>
            </form>            

            <hr class="mt-2 mb-2">
            
            
            <div>
              <p>Description: </p>
              <ul>
                <li>Project Name: ${obj.projectName}</li>
                <li>Project Description: ${obj.projectDescription}</li>
              </ul>
            </div>
      
            <span class="message">Latest Communication: </span><br>
            <span class="message">${msg}</span>
          
          </div>
          
      </div>
    </div>`;
}

function addBTPCode(student, obj, msg, idx) {
  return `
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">

            <div class="col-1 text-center">
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            </div>

            <div class="accordion-title col-8">${student.email} - ${student.roll} - ${student.name} <span class="tag tag-primary">${obj.projectName}</span> <span class="tag tag-secondary">BTP</span></div>

            <!--Accept-->

            <div class="col-1 text-center"> 
               <i class="bi bi-check-circle" style="color:  #198754;" onclick="event.stopPropagation() ;btpApproved(this,${idx})" data-toggle="tooltip" data-placement="bottom" title="Accept"></i>
            </div>
            
            <!--Reject-->
            <div class="col-1 text-center"> 
               <i class="bi bi-x-circle"  style="color:  #dc3545;" onclick="clickAlternate(event)" data-toggle="tooltip" data-placement="bottom" title="Reject"></i>
            </div>
            
            <div class="col-1 text-center">     
              <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
              <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
            </div>      
          
      </button>
      <div class="accordion-content ">

          <div class="accordion-body">
            <form class="custom-form mx-auto">
              <label>Message: </label>
              <input class="mt-2 form-control message" type="text" placeholder="Send a message ...">
              <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessageBtp(event,${idx})" > Reject</button>
            </form>            

            <hr class="mt-2 mb-2">

            <div>
              <p>Description:</p>
              <ul>
                <li>Project Name: ${obj.projectName}</li>
                <li>Project Description: ${obj.projectDescription}</li>
              </ul>
            </div>
      
            <span class="message">Latest Communication: </span><br>
            <span class="message">${msg}</span>
          
          </div>
          
      </div>
    </div>`;
}

function addIPCode(student, obj, msg, idx) {
  return`
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">

        <div class="col-1 text-center">
          <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
        </div>

        <div class="accordion-title col-8">${student.email} - ${student.roll} - ${student.name} <span class="tag tag-primary">${obj.projectName}</span> <span class="tag tag-secondary">IP/IS/UR</span></div>

        <!--Accept-->

        <div class="col-1 text-center"> 
            <i class="bi bi-check-circle" style="color:  #198754;" onclick="event.stopPropagation() ;ipApproved(this,${idx})" data-toggle="tooltip" data-placement="bottom" title="Accept"></i>
        </div>
        
        <!--Reject-->
        <div class="col-1 text-center"> 
            <i class="bi bi-x-circle"  style="color:  #dc3545;" onclick="clickAlternate(event)" data-toggle="tooltip" data-placement="bottom" title="Reject"></i>
        </div>
        
        <div class="col-1 text-center">     
          <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
          <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
        </div>      
          
      </button>
      <div class="accordion-content ">

        <div class="accordion-body">
          <form class="custom-form mx-auto">
            <label>Message: </label>
            <input class="mt-2 form-control message" type="text" placeholder="Send a message ...">
            <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessageIp(event,${idx})" > Reject</button>
          </form>            

          <hr class="mt-2 mb-2">

          <div>
            <p>Description: </p>
            <ul>
              <li>Project Name: ${obj.projectName}</li>
              <li>Project Description: ${obj.projectDescription}</li>
            </ul>
          </div>
    
          <span class="message">Latest Communication: </span><br>
          <span class="message">${msg}</span>
        
        </div>
          
      </div>
    </div>`;
}

function addAcceptRequestCode(type, obj, student, idx, msg) {
  if (type == "ip") {
    accordion.innerHTML += addAcceptIPCode(student, obj, msg, idx);
  } else if (type == "btp") {
    accordion.innerHTML += addAcceptBTPCode(student, obj, msg, idx);
  }
}

function addRequestCode(type, obj, student, idx, msg) {
  if (type == "ip") {
    accordion.innerHTML += addIPCode(student, obj, msg, idx);
  } else if (type == "btp") {
    accordion.innerHTML += addBTPCode(student, obj, msg, idx);
  }
}

//Filters

function checkProf(student) {
  var profEmail = document.getElementById("profFilter").value;
  var type = document.getElementById("ip/btp").value;

  var status = document.getElementsByClassName("status")[0].id;
  let lists = [];

  if (type == "btp") {
    lists.push("btp");
  } else if (type == "ip") {
    lists.push("ip");
  } else if (type == "all") {
    lists.push("ip");
    lists.push("btp");
  }

  for (var str in lists) {
    let list = lists[str] + "List";
    type = lists[str];

    if (student[list].length == 0) {
      continue;
    }

    for (var i in student[list]) {
      obj = student[list][i];
      if (obj["profEmail"] == profEmail) {
        if (obj[`${type}Message`]) {
          message = obj[`${type}Message`];
        } else {
          message = "You have not sent any message currently.";
        }

        if (status == "pending" && obj[type] == undefined) {
          addRequestCode(type, obj, student, i, message);
        } else if (status == "accepted" && obj[type] == true) {
          addAcceptRequestCode(type, obj, student, i, message);
        } else if (status == "rejected" && obj[type] == false) {
          addRequestCode(type, obj, student, i, message);
        }
      }
    }
  }
}

//Filtering accroding to status and type
function clickProfFilter() {
  var profEmail = document.getElementById("profFilter").value;
  var degree = document.getElementById("degree").value;
  var department = document.getElementById("department").value;
  var batch = document.getElementById("batch").value;
  var type = document.getElementById("ip/btp").value;

  if (!batch) {
    batch = -1;
  }
  var status = document.getElementsByClassName("status")[0].id;
  var currentList = [];

  for (var i in studentList) {
    student = studentList[i];

    let checkDegree = degree == student["degree"];
    let checkDepartment = department == student["department"];
    let checkBatch = batch == student["batch"];

    if (degree == "All") {
      checkDegree = true;
    }

    if (department == "All") {
      checkDepartment = true;
    }

    if (batch == -1) {
      checkBatch = true;
    }

    if (!(checkBatch && checkDepartment && checkDegree)) {
      continue;
    }

    if (type == "ip") {
      for (var j in student["ipList"]) {
        obj = student["ipList"][j];
        if (obj["profEmail"] == profEmail) {
          currentList.push(student);
          break;
        }
      }
    } else if (type == "btp") {
      for (var j in student["btpList"]) {
        obj = student["btpList"][j];
        if (obj["profEmail"] == profEmail) {
          currentList.push(student);
          break;
        }
      }
    } else {
      if (student["btpList"].length != 0) {
        for (var j in student["btpList"]) {
          obj = student["btpList"][j];
          if (obj["profEmail"] == profEmail) {
            currentList.push(student);

            break;
          }
        }
        if (currentList.includes(student)) {
          continue;
        }
      }

      if (student["ipList"].length != 0) {
        for (var j in student["ipList"]) {
          obj = student["ipList"][j];
          if (obj["profEmail"] == profEmail) {
            currentList.push(student);
            break;
          }
        }
      }
    }
  }

  if (status == "accepted") {
    document.getElementById("selectAll").disabled = true;
    document.getElementById("unselectAll").disabled = true;
    document.getElementById("sendAll").disabled = true;
  } else {
    document.getElementById("selectAll").disabled = false;
    document.getElementById("unselectAll").disabled = false;
    document.getElementById("sendAll").disabled = false;

    document.getElementById("selectAll").style.display = "block";
    document.getElementById("unselectAll").style.display = "block";
    document.getElementById("sendAll").style.display = "block";
  }


  accordion.innerHTML = "";
  currentList.map(checkProf);
  if (accordion.innerHTML == "") {
    accordion.innerHTML = `<div class="alert alert-dark mx-3" role="alert">No Requests Found</div>`;
    return;
  }

  const items = document.querySelectorAll(".accordion button");

  function toggleAccordion() {
    const itemToggle = this.getAttribute("aria-expanded");
    for (i = 0; i < items.length; i++) {
      items[i].setAttribute("aria-expanded", "false");
    }
    if (itemToggle == "false") {
      this.setAttribute("aria-expanded", "true");
    }
  }
  items.forEach((item) => item.addEventListener("click", toggleAccordion));
}

//Filtering according to degree, batch etc and then going to filtering by status and type
function applyStatusProfessor() {
  var currProf = document.getElementById("profFilter").value;
  var status = document.getElementsByClassName("status")[0].id; 

  let url = `${CURRENT_URL}/user/getStudents/professor/${currProf}/${status}`;

  document.getElementById("profFilter").style.display = "block";
  document.getElementById("ip/btp").style.display = "block";
  

  //Getting list of students
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
    clickProfFilter();
  }
}

function sendSelectedProf() {
  var profEmail = document.getElementById("profFilter").value;
  var checkboxes = document.getElementsByClassName("tickbox");

  for (var i in checkboxes) {
    if (checkboxes[i].checked == true) {
      if (checkboxes[i].nextSibling) {
        var obj = [];
        var text = checkboxes[i].parentElement.nextElementSibling.innerHTML;
        var list = text.split(" - ");

        var studentEmail = list[0];
        var project = list[list.length - 1];

        var eindex = project.indexOf("</span>");
        var sindex = project.indexOf(">");
        projectName = project.substring(sindex + 1, eindex);

        var admin = project.substring(eindex + 7, project.length);

        var eindex = admin.indexOf("</span>");
        var sindex = admin.indexOf(">");

        admin = admin.substring(sindex + 1, eindex);

        if (admin == "BTP") {
          admin = "btp";
        } else {
          admin = "ip";
        }

        obj.push({
          profEmail: profEmail,
          studentEmail: studentEmail,
          admin: admin,
          projectName: projectName,
        });
      }
    }

    var request = new XMLHttpRequest();
    request.open(
      "GET",
      `${CURRENT_URL}/approveEmailProf/${JSON.stringify(obj)}`,
      false
    );
    request.send(null);
  }

  applyStatus();
}

function clickAlternate(e) {
  var curr_admin = document.getElementById("admins").value;
  if(curr_admin=='professor'){
    clickAlternateProf(e);
  }
  else{
    clickAlternateAdmin(e);
  }
}

function applyStatus(){
  var curr_admin = document.getElementById("admins").value;
  if(curr_admin=='professor'){
    applyStatusProfessor();
  }
  else{
    applyStatusAdmin();
  }
}

//Generating Requests
applyStatus();
