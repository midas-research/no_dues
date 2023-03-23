
const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);

var adminName = JSON.parse(document.getElementById("adminName").innerHTML);

var accordion = document.getElementsByClassName("accordion")[0];

var studentList;

//Checking for pending, rejected, accepted
function check(student) {
  let curr_status=document.getElementsByClassName('status')[0].id;
  if (curr_status == "pending") {
    return student[adminName + "Applied"] && student[adminName] == null;
  } else if (curr_status == "accepted") {
    return student[adminName] == true;
  } else {
    return student[adminName] == false;
  }
}

//Checking for varoius filters like batch, degree, department
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

  let res =
    checkDegree && checkDepartment && checkBatch;

  if (adminName == "hostel") {
    var currHostelTaken = document.getElementById("hostelTaken").value;
    if (currHostelTaken == "true") {
      currHostelTaken = true;
    } else if (currHostelTaken == "false") {
      currHostelTaken = false;
    }

    var checkHostelTaken = currHostelTaken == student["hostelTaken"];

    if (currHostelTaken == "all") {
      checkHostelTaken = true;
    }

    res = res & checkHostelTaken;
  }

  return res;
}

function displayCustomText(student) {
  if (adminName == "hostel") {
    var hostelTaken = "Hostel Taken";
    if (student.hostelTaken == false) {
      hostelTaken = "Hostel Not Taken";
    }
    return `${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${hostelTaken}</span>`;
  }
  return `${student.email} - ${student.roll} - ${student.name}`;
}

//Applying Filters
function clickFilter() {
  
  var curr_batch = document.getElementById("batch").value;
  let curr_status = document.getElementsByClassName("status")[0].id;

  if (!curr_batch) {
    curr_batch = -1;
  }

  var currentList = [];
  studentList.map(function (student) {
    if (isTrue(student)) {
      currentList.push(student);
    }
  });

  //Select All, Unselect All, Send Selected won't work with accepted
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
  currentList.map(addCode);

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

//applyStatus
function applyStatus(){
  
  let curr_status = document.getElementsByClassName("status")[0].id;  
  
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${adminName}/${curr_status}`, false);
  request.send(null);
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);    
    clickFilter();
  }
}

//html code for accepted div
function addAcceptCode(student, msg) {
  accordion.innerHTML += `
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">
            
            <div class="accordion-title col-11">${displayCustomText(
              student
            )}</div>
            
            <div class="col-1 text-center">     
              <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
              <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
            </div> 
      </button>

      <div class="accordion-content ">

          <div class="accordion-body">
            <i style="color: red;">Please inform nodues department incase you wish to reject this request. </i><br><br>
            <span class="message">Latest Communication: </span><br>
            <span class="message">${msg}</span>          
          </div>
          
      </div>
    </div>`;
}

//html code for reject and pending div
function addNormalCode(student, msg) {
  accordion.innerHTML += `
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">

            <div class="col-1 text-center">
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
            </div>

            <div class="accordion-title col-8">${displayCustomText(
              student
            )}</div>

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
              <button class="form-button btn btn-danger mt-3" type='button'  onclick="sendMessage(event)" > Reject</button>
            </form>            

            <hr class="mt-2 mb-2">

            <span class="message">Latest Communication: </span><br>
            <span class="message">${msg}</span>
          
          </div>
          
      </div>
    </div>`;
}

//Div Code for each request
function addCode(student) {
  let curr_status = document.getElementsByClassName("status")[0].id;

  var message;
  if (student[adminName + "Message"]) {
    message = "Message: "+student[adminName + "Message"];
  } else {
    message = "Message: You have not been sent any message currently.";
  }

  if(student[adminName+ "Fine"]){
    message+=`<br> Fine: Rs. ${student[adminName+"Fine"]} `;
  }
  else{
    message += `<br> Fine: NA`;
  }

  if (curr_status == "accepted") {
    addAcceptCode(student, message);
  } else {
    addNormalCode(student, message);
  }
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


//Functionality if request accepted
function approved(e) {  
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
    admin: adminName,
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

//Functionality of reject button in accordion button

function clickAlternate(e){  
  let element=e.target.parentElement.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].childNodes[9];
  element.click();
}

//Functionality if request rejected
function sendMessage(e) {
  
  var fine = e.target.previousElementSibling.value;
  if(fine==null){
    fine=0;
  }
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
    admin: adminName,
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

//Show sheet functionality
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

//code for selectAll, send Selected, Unselect All

//selectAll functionality
var selectAll = document.getElementById("selectAll");
selectAll.addEventListener("click", () => {
  var checkboxes = document.getElementsByClassName("tickbox");
  for (var i in checkboxes) {
    checkboxes[i].checked = true;
  }
});

//unselectAll functionality
var unselectAll = document.getElementById("unselectAll");
unselectAll.addEventListener("click", () => {
  var checkboxes = document.getElementsByClassName("tickbox");
  for (var i in checkboxes) {
    checkboxes[i].checked = false;
  }
});

//Send Selected functionality
var sendAll = document.getElementById("sendAll");
sendAll.addEventListener("click", () => {
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
          adminName: adminName,
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
});
