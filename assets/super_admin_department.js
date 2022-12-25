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
adminList.pop();
adminList.pop();
adminList.pop();
adminList.push("academics");

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

//html Code For Accepted Requests
function addAcceptCode(student, msg, curr_admin) {
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
            <span class="reject_request input-group-append" onclick="sendMessage(event,'${curr_admin}')"> Reject </span>   
          </div>

          <span class="message">Approved : ${
            student[curr_admin + "ApprovedAt"]
          }</span><br>
          <span class="message">Latest Communication before Accepting: </span><br>
          <span class="message">${msg}</span><br>
          <span class="message">Requested : ${
            student[curr_admin + "AppliedAt"]
          }</span>

        </div>
      </div>`;
}

//Filter Logic (clickFilter->isTrue->check)
function check(student, curr_status, curr_admin) {
  if (curr_status == "pending") {
    return (
      student[curr_admin + "Applied"] == true && student[curr_admin] == null
    );
  } else if (curr_status == "accepted") {
    return student[curr_admin] == true;
  } else {
    return student[curr_admin] == false;
  }
}

function isTrue(student) {
  var curr_status = document.getElementById("status").value;
  var curr_degree = document.getElementById("degree").value;
  var curr_department = document.getElementById("department").value;
  var curr_batch = document.getElementById("batch").value;
  var curr_admin = document.getElementById("admins").value;

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
    checkBatch &&
    check(student, curr_status, curr_admin)
  );
}

function clickFilter() {
  var curr_status = document.getElementById("status").value;

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

  //if there are no requests
  if (currentList.length == 0) {
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
    return;
  }

  accordion.innerHTML = "";

  var curr_admin = document.getElementById("admins").value;

  //Adding requests if any
  for (var i in currentList) {
    //Setting message to be displayed for each request
    var message;
    if (currentList[i][curr_admin + "Message"]) {
      message = currentList[i][curr_admin + "Message"];
    } else {
      message = "You have not sent any message currently.";
    }

    if (curr_status == "accepted") {
      //html code for accepted filter
      accordion.innerHTML += addAcceptCode(currentList[i], message, curr_admin);
    } else {
      //html code for pending/rejected filter
      accordion.innerHTML += `
        <div class="accordion-item filter-btech">
          <button id="accordion-button-1" aria-expanded="false">
              <span class="accordion-title">${currentList[i].email} - ${currentList[i].roll} - ${currentList[i].name}</span>
              <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
              <span class="accept_request" onclick="event.stopPropagation() ;approved(this,'${curr_admin}')"> Accept </span>
              <!--<i class="fas fa-check-circle send_request" onclick="event.stopPropagation() ;approved(this,'${curr_admin}')"></i>-->
              <span class="icon" aria-hidden="true"></span>
          </button>
          <div class="accordion-content">
            
            
            <div class="input-group mb-3">
              
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2" required>
              <span class="reject_request input-group-append" onclick="sendMessage(event,'${curr_admin}')"> Reject </span>   
              <!--<div class="input-group-append">
                  <i class="fas fa-paper-plane send" onclick="sendMessage(event,'${curr_admin}')"></i>
              </div>-->
            </div>
            <span class="message">Latest Communication: </span><br>
            <span class="message">   ${message}</span>
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
function getAdminRequests() {
  var curr_admin = document.getElementById("admins").value;

  //Getting list of students
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${curr_admin}`, false);
  request.send();
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
  }

  //applying filter
  clickFilter();
}

//Accepting a Request
function approved(e, curr_admin) {
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
    admin: curr_admin,
    email: email,
    id: studentId,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/approveDues/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);

  getAdminRequests();
}

//Rejecting a Request
function sendMessage(e, curr_admin) {
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
    admin: curr_admin,
    message: dues,
    email: email.substring(0, index),
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/sendMessage/${JSON.stringify(obj)}`,
    false
  );
  request.send();

  getAdminRequests();
}

//Generating Requests
getAdminRequests();

//Adding Search button, Admin Button and Status Button Functionality
var search = document.getElementById("search");
search.addEventListener("click", clickFilter);

var status_button = document.getElementById("status");
status_button.addEventListener("click", clickFilter);

var admins_button = document.getElementById("admins");
admins_button.addEventListener("click", getAdminRequests);

//Sheet Functionality
var sheet = document.getElementById("sheet");
sheet.addEventListener("click", () => {
  window.location.href = `${CURRENT_URL}/showSheet`;
});

//Home Functionality
var home = document.getElementById("superAdminHome");
home.addEventListener("click", () => {
  window.location.href = `${CURRENT_URL}/super_admin`;
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
  var curr_admin = document.getElementById("admins").value;
  for (var i in checkboxes) {
    if (checkboxes[i].checked == true) {
      if (checkboxes[i].previousElementSibling) {
        var text = checkboxes[i].previousElementSibling.innerHTML;
        var index = text.indexOf(" ");
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

    getAdminRequests();
  }
});
