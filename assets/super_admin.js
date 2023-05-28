const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
var admins_temp = JSON.parse(document.getElementById("adminList").innerHTML);
var adminList=[];
var id = document.getElementById("id").innerHTML;
var superAdminName = document.getElementById("adminName").innerHTML;

var accordion = document.getElementsByClassName("accordion")[0];


function adminsLeft(student) {
  adminList=[];

  for (var i in admins_temp) {
    if (i >= 11 && i <= 16) {
      //skipping admin CSE, admin ECE etc.
      continue;
    }

    adminList.push(admins_temp[i]);
  }
  adminList.push(`admin${student.department}`);

  var check=1;
  for (var i in adminList) {
    if (!(student[adminList[i]] == true)) {
      if(check!=0){
        check=2;
      }
      else{
        check=0;
      }
    }
    else{
      if(check==0){
        check=2;
      }
    }
  }

  if(student['ipList'].length==0){
    if (check == 0) {
      check = 2;
    }
  }

  for (var i in student["ipList"]) {
    if (!(student["ipList"][i] == true)) {
      if (check != 0) {
        check = 2;
      }
      else{
        check=0;
      }
    }
    else{
      if (check == 0) {
        check = 2;
      }
    }
  }

  if (student["btpList"].length == 0) {
    if (check == 0) {
      check = 2;
    }
  }

  for (var i in student["btpList"]) {
    if (!(student["btpList"][i] == true)) {
      if (check != 0) {
        check = 2;
      }
      else{
        check=0;
      }
    }
    else{
      if (check == 0) {
        check = 2;
      }
    }
  }

  return check;
}

function generateTag(student){
  let num=adminsLeft(student);
  
  if(num==0){
    return '<span class="tag tag-red">None Clear</span>';
  }
  else if(num==1){
    return '<span class="tag tag-green">All Clear</span>';
  }
  return '<span class="tag tag-yellow">Some Clear</span>';
}

function addAcceptCode(student, msg) {
  return `
        <div class="accordion-item container">
          <button class="row accordion-heading" type="button" aria-expanded="false">
            <div class="col-1 text-center">
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            </div>

            <div class="accordion-title col-6">${student.email} - ${
    student.roll
  } - ${student.name} 
            </div>

            <div class="col-2 text-center">
            ${generateTag(student)}
            </div>

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
                <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessage(event)" > Reject</button>
              </form>            

              <hr class="mt-2 mb-2">

              <span class="message">Latest Communication: </span><br>
              <span class="message">${msg}</span>

              <div class="admins-status">
                ${addBankAndPersonalContent(student)}
                ${addDonationContent(student)}
                ${addFineContent(student)} 
                ${addClearanceContent(student)} 
              </div>
            
            </div>
            
          </div>
        </div> `;
}

function addClearanceContent(student) {
  uncleared = `<hr>
            <p><em>UnCleared Status: </em></p>
              <ul>`;
  cleared = `
  <hr>
  <p><em>Cleared Status: </em></p> 
            <ul>`;

  adminList=[];

  for (var i in admins_temp) {
    if (i >= 11 && i <= 16) {
      //skipping admin CSE, admin ECE etc.
      continue;
    }

    adminList.push(admins_temp[i]);
  }
  adminList.push(`admin${student.department}`);

  for (var i in adminList) {
    var j = student[adminList[i]];
    if (j == null) {
      j = false;
    }
    if (j == true) {
      cleared += `<li> ${adminList[i]} : Yes </li>`;
    } else {
      uncleared += `<li> ${adminList[i]} : No </li>`;
    }
  }

  let ipCheck = "Yes";

  for (var i in student["ipList"]) {
    if (!(student["ipList"][i]["ip"] == true)) {
      ipCheck = "No";
      break;
    }
  }
  if (ipCheck == "Yes") {
    cleared += `<li> IP : Yes </li>`;
  } else {
    uncleared += `<li> IP : No </li>`;
  }

  let btpCheck = "Yes";

  for (var i in student["btpList"]) {
    if (!(student["btpList"][i]["btp"] == true)) {
      btpCheck = "No";
      break;
    }
  }
  if (btpCheck == "Yes") {
    cleared += `<li> Btp : Yes </li>`;
  } else {
    uncleared += `<li> Btp : No </li>`;
  }

  uncleared += `</ul>`;
  cleared += `</ul>`;
  return cleared + uncleared;
}

function addFineContent(student) {
  content = `<hr>
            <p>Total Fine : ${student['totalFine']} </p>
            <ul>
            `;
  adminList = [];

  for (var i in admins_temp) {
     if (i >= 11 && i <= 16) {
       //skipping admin CSE, admin ECE etc.
       continue;
     }

     adminList.push(admins_temp[i]);
  }
  adminList.push(`admin${student.department}`);
  for (var i in adminList) {
    var j = student[adminList[i]+'Fine'];
    if (j == 0) {
      continue;
    }    
    content += `<li> ${adminList[i]}: ${student[adminList[i]+'Fine']}</li>`;    
  }  
  content += `</ul>`;
  return content;
}

function addDonationContent(student) {
  content = `<hr>
            <p>Total Donation : ${student["donationAmount"]} </p>
            <p>Donation Department: ${student["donationAdmin"]}</p>  `;

  
  return content;
}

function addBankAndPersonalContent(student) {
  let bank='Not Filled';
  let personal='Not Filled';
  if (student["bankAccountHolder"]){
    bank='Filled';
  }
  if(student['reason_of_leaving']){
    personal='Filled';
  }
  content = `<hr>
          <p>Bank Details: ${bank} </p>
          <p>Personal Details: ${personal}</p>  `;

  return content;
}

function check(student, curr_status) {
  if (curr_status == "pending") {
    return student[superAdminName] == null;
  } else if (curr_status == "accepted") {
    return student[superAdminName] == true;
  } else {
    return student[superAdminName] == false;
  }
}

function isTrue(student) {
  
  var curr_degree = document.getElementById("degree").value;
  var curr_department = document.getElementById("department").value;
  var curr_batch = document.getElementById("batch").value;
  var clearance = document.getElementById("clearance").value;

  var k = "none";
  if (adminsLeft(student)==1) {
    k = "complete";
  }
  else if(adminsLeft(student)==2){
    k= "some"
  }

  var checkDegree = curr_degree == student["degree"];
  var checkDepartment = curr_department == student["department"];
  var checkBatch = curr_batch == student["batch"];

  var checkClearance = clearance == k;

  if (!curr_batch) {
    curr_batch = -1;
  }

  if (clearance == "all") {
    checkClearance = true;
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
    checkClearance &&
    checkDegree &&
    checkDepartment &&
    checkBatch
  );
}

//Applying filters and adding request components
function clickFilter() {
  let curr_status = document.getElementsByClassName("status")[0].id;
  var curr_batch = document.getElementById("batch").value;

  if (!curr_batch) {
    curr_batch = -1;
  }

  var currentList = [];

  for (var i in studentList) {
    if (isTrue(studentList[i])) {
      currentList.push(studentList[i]);
    }
  }

  if (curr_status == "accepted") {
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

  //No Requests for this filter
  if (currentList.length == 0) {
    accordion.innerHTML = `<div class="alert alert-dark mx-3" role="alert">No Requests Found</div>`;
    return;
  }

  accordion.innerHTML = "";
  for (var i in currentList) {
    var message;
    if (currentList[i][superAdminName + "Message"]) {
      message = currentList[i][superAdminName + "Message"];
    } else {
      message = "You have not sent any message currently.";
    }

    if (check(currentList[i], curr_status) && curr_status == "accepted") {
      accordion.innerHTML += addAcceptCode(currentList[i], message);
    } else if (check(currentList[i], curr_status)) {
      accordion.innerHTML += `
        <div class="accordion-item container">
          <button class="row accordion-heading align-items-center" type="button" aria-expanded="false">

            <div class="col-1 text-center">
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            </div>

            <div class="accordion-title col-6">${currentList[i].email} - ${
        currentList[i].roll
      } - ${currentList[i].name} 
            </div>
            <div class="col-2 text-center">
            ${generateTag(currentList[i])}
            </div>

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
                <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessage(event)" > Reject</button>
              </form>            

              <hr class="mt-2 mb-2">

              <span class="message">Latest Communication: </span><br>
              <span class="message">${message}</span>

              <div class="admins-status">
                ${addBankAndPersonalContent(currentList[i])}
                ${addDonationContent(currentList[i])}
                ${addFineContent(currentList[i])} 
                ${addClearanceContent(currentList[i])} 
              </div>
            
            </div>
            
          </div>
        </div> `;
    }    
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

//Pending Rejected Accepted
function applyStatus() {
  let curr_status = document.getElementsByClassName("status")[0].id;
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${curr_status}`, false);
  request.send();
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
    clickFilter();
  }
}

//Functionality if request rejected
function sendMessage(e) {
  var dues = e.target.previousElementSibling.value;
  const pattern = /^[a-zA-Z0-9.,-\s]+$/; 
  if (dues == "" || !pattern.test(dues)) {
    alert("You need to give a message before rejecting and use only Alphanumeric characters and either of [periods(.), commas(,), hypen(-)]");
    return;
  }
  var email = e.target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[3].innerHTML;
  var index = email.indexOf(" ");
  var obj = [];

  obj.push({
    admin: superAdminName,
    message: dues,
    email: email.substring(0, index),
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/superSendMessage/${JSON.stringify(obj)}`,
    false
  );
  request.send();

  applyStatus();
}

//Functionality if request accepted
function approved(e) {
  var emailroll = e.parentElement.previousElementSibling.previousElementSibling.innerHTML;
  var email = emailroll.substring(0, emailroll.indexOf(" -"));

  var studentId;
  for (var i in studentList) {
    if (studentList[i]["email"] == email) {
      studentId = studentList[i]["_id"];
    }
  }

  var obj = [];
  obj.push({
    admin: superAdminName,
    email: email,
    id: studentId,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/superApproveDues/${JSON.stringify(obj)}`,
    false
  );
  request.send();

  applyStatus();
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

//Adding requests with inital filters
applyStatus();

//Whenever search is selected, filter requests

const filters = document.querySelectorAll(".filter");
filters.forEach(function (btn) {
  btn.addEventListener("click",clickFilter);
});

document.getElementById('batchButton').addEventListener('click',clickFilter);

//Functionality of reject button in accordion button
function clickAlternate(e){  
  
  let element=e.target.parentElement.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].childNodes[5];
  element.click();
}

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

//code for sending multiple students at a time
var sendAll = document.getElementById("sendAll");
sendAll.addEventListener("click", () => {
  var checkboxes = document.getElementsByClassName("tickbox");
  
  var obj = [];
  
  for (var i in checkboxes) {
 
    if (checkboxes[i].checked == true) {
      if (checkboxes[i].nextSibling) {
        
        var text = checkboxes[i].parentElement.nextElementSibling.innerHTML;
        var index = text.indexOf(" -");
        var studentEmail = text.substring(0, index);

        obj.push({
          studentEmail: studentEmail,
          adminName: superAdminName,
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
      `${CURRENT_URL}/superApproveManyDues/${JSON.stringify(obj2)}`,
      false
    );
    request.send();

    applyStatus();
  }
});
