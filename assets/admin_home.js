const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);

var adminName = document.getElementById("adminName").innerHTML;
var accordion = document.getElementsByClassName("accordion")[0];

var studentList;
var request = new XMLHttpRequest();
request.open("GET", `${CURRENT_URL}/user/getStudents/${adminName}`, false);
request.send(null);
if (request.status === 200) {
  studentList = JSON.parse(request.responseText);
}

//Checking for pending, rejected, accepted
function check(student, curr_status) {
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
  var curr_status = document.getElementById("status").value;
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
    checkDegree && checkDepartment && checkBatch && check(student, curr_status);

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
    return `<span class="accordion-title"> ${student.email} - ${student.roll} - ${student.name} - ${hostelTaken}</span>`;
  }
  return `<span class="accordion-title"> ${student.email} - ${student.roll} - ${student.name}</span>`;
}

//Applying Filters
function clickFilter() {
  var curr_status = document.getElementById("status").value;
  var curr_batch = document.getElementById("batch").value;

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

  //No Requests for this filter
  if (currentList.length == 0) {
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
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

//html code for accepted div
function addAcceptCode(student, msg) {
  accordion.innerHTML += `<div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            ${displayCustomText(student)}
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
          
          <span class="message">Approved : ${
            student[adminName + "ApprovedAt"]
          }</span><br>
          <span class="message">Latest Communication before Accepting: </span><br>
          <span class="message">${msg}</span><br>
          <span class="message">Requested : ${
            student[adminName + "AppliedAt"]
          }</span>
        </div>
      </div>`;
}

//html code for reject and pending div
function addNormalCode(student, msg) {
  accordion.innerHTML += `<div class="accordion-item filter-btech">
         <button id="accordion-button-1" aria-expanded="false">
             ${displayCustomText(student)}
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
           <span class="message">${msg}</span>
         </div>
       </div>`;
}

//Div Code for each request
function addCode(student) {
  var curr_status = document.getElementById("status").value;

  var message;
  if (student[adminName + "Message"]) {
    message = student[adminName + "Message"];
  } else {
    message = "You have not sent any message currently.";
  }

  if (curr_status == "accepted") {
    addAcceptCode(student, message);
  } else {
    addNormalCode(student, message);
  }
}

//Whenever search is selected, filter requests
var search = document.getElementById("search");
search.addEventListener("click", clickFilter);

//Whenever status_button is selected, filter requests
var status_button = document.getElementById("status");
status_button.addEventListener("click", clickFilter);

//Adding requests with inital filters
clickFilter();

//Functionality if request accepted
function approved(e) {
  var r = e.parentElement.parentElement;
  var emailroll = e.parentElement.childNodes[1].innerHTML;

  var email = emailroll.substring(1, emailroll.indexOf(" -"));
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
    id: studentId,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/approveDues/${JSON.stringify(obj)}`,
    false
  );
  request.send(null);

  request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${adminName}`, false);
  request.send(null);
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
    clickFilter();
  }
}

//Functionality if request rejected
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

  var index = email.indexOf(" -");
  email = email.substring(1, index);

  var obj = [];
  obj.push({
    admin: adminName,
    message: dues,
    email: email,
  });

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/sendMessage/${JSON.stringify(obj)}`,
    false
  );
  request.send();

  request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${adminName}`, false);
  request.send(null);
  if (request.status === 200) {
    studentList = JSON.parse(request.responseText);
    clickFilter();
  }
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
    //Checking which request to accept
    if (checkboxes[i].checked == true) {
      if (checkboxes[i].previousElementSibling) {
        var text = checkboxes[i].previousElementSibling.innerHTML;
        var index = text.indexOf(" -");
        var studentEmail = text.substring(1, index);

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

    request = new XMLHttpRequest();
    request.open("GET", `${CURRENT_URL}/user/getStudents/${adminName}`, false);
    request.send(null);
    if (request.status === 200) {
      studentList = JSON.parse(request.responseText);
      clickFilter();
    }
  }
});
