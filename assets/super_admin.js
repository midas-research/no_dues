const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
var adminList = JSON.parse(document.getElementById("adminList").innerHTML);
var id = document.getElementById("id").innerHTML;
var superAdminName = document.getElementById("adminName").innerHTML;

var accordion = document.getElementsByClassName("accordion")[0];


function check(student, curr_status) {
  if (curr_status == "pending") {
    return student[superAdminName] == null;
  } else if (curr_status == "accepted") {
    return student[superAdminName] == true;
  } else {
    return student[superAdminName] == false;
  }
}

function adminsLeft(student) {
  for (var i in adminList) {
    if (!(student[adminList[i]] == true)) {
      return false;
    }
  }

  for (var i in student["ipList"]) {
    if (!(student["ipList"][i] == true)) {
      return false;
    }
  }

  for (var i in student["btpList"]) {
    if (!(student["btpList"][i] == true)) {
      return false;
    }
  }

  return true;
}

function addAcceptCode(student, msg) {
  return `<div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${student.email} - ${
    student.roll
  } - ${student.name}</span>
            <span class="icon" aria-hidden="true"></span>
            
        </button>
        <div class="accordion-content">
          <div class="input-group mb-3">
             
            <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2" required>
            <span class="reject_request input-group-append" onclick="sendMessage(event)"> Reject </span>   
          </div>

          
          <span class="message">Approved : ${
            student[superAdminName + "ApprovedAt"]
          }</span><br>
          <span class="message">Latest Communication before Accepting: </span><br>
          <span class="message">${msg}</span><br>
          <hr>
          <div class="admins-status">
              ${addcontent(student)} 
          </div>

        </div>
        
      </div>`;
}

function isTrue(student) {
  var curr_status = document.getElementById("status").value;
  var curr_degree = document.getElementById("degree").value;
  var curr_department = document.getElementById("department").value;
  var curr_batch = document.getElementById("batch").value;
  var clearance = document.getElementById("clearance").value;

  var k = "not cleared";
  if (adminsLeft(student)) {
    k = "cleared";
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

function addcontent(student) {
  uncleared = `<hr><h5>UnCleared Status: </h5>
              <ul>`;
  cleared = `<h5>Cleared Status: </h5> 
            <ul>`;
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

function clickFilter() {
  var curr_status = document.getElementById("status").value;
  var curr_degree = document.getElementById("degree").value;
  var curr_department = document.getElementById("department").value;
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

    document.getElementById("selectAll").style.display = "none";
    document.getElementById("unselectAll").style.display = "none";
    document.getElementById("sendAll").style.display = "none";
  } else {
    document.getElementById("selectAll").disabled = false;
    document.getElementById("unselectAll").disabled = false;
    document.getElementById("sendAll").disabled = false;

    document.getElementById("selectAll").style.display = "flex";
    document.getElementById("unselectAll").style.display = "flex";
    document.getElementById("sendAll").style.display = "flex";
  }

  if (currentList.length == 0) {
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
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
      k = "Not Clear";
      if (adminsLeft(currentList[i])) {
        k = "All Clear";
      }
     
      accordion.innerHTML += `
       <div class="accordion-item filter-btech">
         <button id="accordion-button-1" aria-expanded="false">
             <span class="accordion-title">${currentList[i].email} - ${
        currentList[i].roll
      } - ${currentList[i].name} - <span class="tag tag-tertiary">${k}</span></span>           
                             
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
           <hr>
           <div class="admins-status">
              ${addcontent(currentList[i])} 
            </div>
         </div>
       </div>`;

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

function applyStatus(){
  var curr_status = document.getElementById("status").value;
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${curr_status}`, false);
  request.send();
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
    clickFilter();
  }

}

applyStatus();

function sendMessage(e) {
  var dues = e.target.previousElementSibling.value;
  if (dues == "") {
    alert("You need to give a message before rejecting!");
    return;
  }
  var message = e.target.parentElement.nextElementSibling;
  message.innerHTML = dues;
  var email =
    e.target.parentElement.parentElement.previousElementSibling.childNodes[1]
      .textContent;
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

function approved(e) {
  var r = e.parentElement.parentElement;
  var emailroll = e.parentElement.childNodes[1].innerHTML;
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

//Adding ClickFilter Option to search and status_button
var search = document.getElementById("search");
search.addEventListener("click", clickFilter);

var status_button = document.getElementById("status");
status_button.addEventListener("click", applyStatus);

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

//Admin Requests Functionality
// var adminRequests = document.getElementById("adminRequests");
// adminRequests.addEventListener("click", () => {
//   window.location.href = `${CURRENT_URL}/super_admin/adminRequests`;
// });

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
      if (checkboxes[i].previousElementSibling) {
        var text = checkboxes[i].previousElementSibling.innerHTML;
        var index = text.indexOf(" ");       
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
