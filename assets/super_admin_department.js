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
    checkBatch    
  );
}

function clickFilter() {
  var curr_admin = document.getElementById("admins").value;
  if (curr_admin == "professor") {
    var sendAll = document.getElementById("sendAll");
    sendAll.removeEventListener("click", sendSelectedAdmin);
    sendAll.addEventListener("click", sendSelectedProf);

    var search = document.getElementById("search");
    search.removeEventListener("click", clickFilter);
    search.addEventListener("click", clickProfFilter);

    var status_button = document.getElementById("status");
    status_button.removeEventListener("click", clickFilter);
    status_button.addEventListener("click", clickProfFilter);

    document.getElementsByClassName("prof")[1].style.display = "inline-block";
    document.getElementsByClassName("prof")[0].style.display = "inline-block";
    document.getElementById("ip/btp").style.display = "inline-block";
    generateProfRequests();
    return;
  } else {
    var sendAll = document.getElementById("sendAll");
    sendAll.addEventListener("click", sendSelectedAdmin);
    sendAll.removeEventListener("click", sendSelectedProf);

    var search = document.getElementById("search");
    search.addEventListener("click", clickFilter);
    search.removeEventListener("click", clickProfFilter);

    var status_button = document.getElementById("status");
    status_button.removeEventListener("click", clickProfFilter);
    status_button.addEventListener("click", clickFilter);

    document.getElementsByClassName("prof")[0].style.display = "none";
    document.getElementsByClassName("prof")[1].style.display = "none";
    document.getElementById("ip/btp").style.display = "none";
  }

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
  var curr_status = document.getElementById("status").value;

  //Getting list of students
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getStudents/${curr_admin}/${curr_status}`, false);
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

//Approving Multiple Admin Requests
function sendSelectedAdmin() {
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
}

//Adding Search button, Admin Button and Status Button Functionality
var search = document.getElementById("search");
search.addEventListener("click", clickFilter);

var status_button = document.getElementById("status");
status_button.addEventListener("click", getAdminRequests);

var admins_button = document.getElementById("admins");
admins_button.addEventListener("click", getAdminRequests);

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

//Home Functionality
// var home = document.getElementById("superAdminHome");
// home.addEventListener("click", () => {
//   window.location.href = `${CURRENT_URL}/super_admin`;
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
sendAll.addEventListener("click", sendSelectedAdmin);

//Professor Functions

var profButton = document.getElementById("profFilter");
profButton.addEventListener("click", generateProfRequests);

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
  var message = e.target.parentElement.nextElementSibling;
  message.innerHTML = dues;
  var email =
    e.target.parentElement.parentElement.previousElementSibling.childNodes[1]
      .textContent;
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

  generateProfRequests();
}

function sendMessageIp(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
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

  generateProfRequests();
}

function btpApproved(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
  var r = e.parentElement.parentElement;
  var emailroll = e.parentElement.childNodes[1].innerHTML;
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

  generateProfRequests();
}

function ipApproved(e, idx) {
  var profEmail = document.getElementById("profFilter").value;
  var r = e.parentElement.parentElement;
  var emailroll = e.parentElement.childNodes[1].innerHTML;
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

  generateProfRequests();
}

function addAcceptIPCode(student, obj, msg, idx) {
  return `
      <div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${obj.projectName}</span> - <span class="tag tag-secondary">IP/IS/UR</span></span>
            <span class="icon" aria-hidden="true"></span>
            
        </button>
        <div class="accordion-content">
      
          <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
              <span class="reject_request input-group-append" onclick="sendMessageIp(event,${idx})"> Reject </span>  
          </div>
          <div>
            
            <h5>Description: </h5>
            <ul>
              <li>Project Name: ${obj.projectName}</li>
              <li>Project Description: ${obj.projectDescription}</li>
            </ul>
            <span class="message">Approved : ${obj["ipApprovedAt"]}</span><br>
            <span class="message">Latest Communication before Accepting: </span>
            <span class="message">${msg}</span><br>
            <span class="message">Requested : ${obj["ipAppliedAt"]}</span>
            <br>
          </div>
        </div>
      </div>`;
}

function addAcceptBTPCode(student, obj, msg, idx) {
  return `<div class="accordion-item filter-btech">
      <button id="accordion-button-1" aria-expanded="false">
          <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class=".tag .tag-primary">${obj.projectName}</span> - <span class=".tag .tag-secondary">BTP</span></span>
          <span class="icon" aria-hidden="true"></span>
          
      </button>
      <div class="accordion-content">
      
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
          <span class="reject_request input-group-append" onclick="sendMessageBtp(event,${idx})"> Reject </span>   
        </div>
        <div>
          <h5>Description: </h5>
          <ul>
            <li>Project Name: ${obj.projectName}</li>
            <li>Project Description: ${obj.projectDescription}</li>
          </ul>         
          
          <span class="message">Approved : ${obj["btpApprovedAt"]}</span><br>
          <span class="message">Latest Communication before Accepting: </span>
          <span class="message">${msg}</span><br>
          <span class="message">Requested : ${obj["btpAppliedAt"]}</span><br>
        </div>
      </div>
    </div>`;
}

function addBTPCode(student, obj, msg, idx) {
  return ` <div class="accordion-item filter-btech">
            <button id="accordion-button-1" aria-expanded="false">
                <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class=".tag .tag-primary">${obj.projectName}</span> - <span class=".tag .tag-secondary">BTP</span></span>
                <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
                <span class="send_request accept_request" onclick="event.stopPropagation() ;btpApproved(this,${idx})"> Accept </span>
                <span class="icon" aria-hidden="true"></span>
            </button>
            <div class="accordion-content">
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
                <span class="reject_request input-group-append" onclick="sendMessageBtp(event,${idx})"> Reject </span><br> 
                <hr>
              </div>
              <div>
                <h5>Description: </h5>
                <ul>
                  <li>Project Name: ${obj.projectName}</li>
                  <li>Project Description: ${obj.projectDescription}</li>
                </ul>
              </div>
              <span class="message">Latest Communication: </span>
              <span class="message">${msg}</span>
            </div>
          </div>`;
}

function addIPCode(student, obj, msg, idx) {
  return `<div class="accordion-item filter-btech">
            <button id="accordion-button-1" aria-expanded="false">                
                <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${obj.projectName}</span> - <span class="tag tag-secondary">IP/IS/UR</span></span>
                <input type="checkbox" class="tickbox" onclick="event.stopPropagation()">
                <span class="send_request accept_request" onclick="event.stopPropagation() ;ipApproved(this,${idx})"> Accept </span>
                <span class="icon" aria-hidden="true"></span>
            </button>
            <div class="accordion-content">
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Send a message ..." aria-label="Recipient's username" aria-describedby="basic-addon2">
                <span class="reject_request input-group-append" onclick="sendMessageIp(event,${idx})"> Reject </span><br><br>
                <hr>
              </div>
              <div>
                <h5>Description: </h5>
                <ul>
                  <li>Project Name: ${obj.projectName}</li>
                  <li>Project Description: ${obj.projectDescription}</li>
                </ul>
              </div>
              <span class="message">Latest Communication: </span>
              <span class="message">${msg}</span>
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

function checkProf(student) {
  var profEmail = document.getElementById("profFilter").value;
  var type = document.getElementById("ip/btp").value;

  var status = document.getElementById("status").value;
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

function clickProfFilter() {
  var profEmail = document.getElementById("profFilter").value;
  var degree = document.getElementById("degree").value;
  var department = document.getElementById("department").value;
  var batch = document.getElementById("batch").value;
  var type = document.getElementById("ip/btp").value;

  if (!batch) {
    batch = -1;
  }
  var status = document.getElementById("status").value;
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

  accordion.innerHTML = "";
  currentList.map(checkProf);
  if (accordion.innerHTML == "") {
    accordion.innerHTML = '<div id="NoRequest"> No Requests Found!</div>';
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

function generateProfRequests() {
  var currProf = document.getElementById("profFilter").value;
  var status = document.getElementById("status").value;

  let url = `${CURRENT_URL}/user/getStudents/professor/${currProf}/${status}`;
  

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
    if (checkboxes[i].previousElementSibling) {
      var obj = [];
      var text = checkboxes[i].previousElementSibling.innerHTML;
      var list = text.split(" - ");

      var studentEmail = list[0];
      var projectName = list[list.length - 2];
      var eindex = projectName.indexOf("</span>");
      var sindex = projectName.indexOf(">");

      projectName = projectName.substring(sindex + 1, eindex);

      var admin = list[list.length - 1];
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

      var request = new XMLHttpRequest();
      request.open(
        "GET",
        `${CURRENT_URL}/approveEmailProf/${JSON.stringify(obj)}`,
        false
      );
      request.send(null);
    }
  }

  generateProfRequests();
}

//Generating Requests
getAdminRequests();
