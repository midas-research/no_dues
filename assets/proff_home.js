const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
var profEmail = document.getElementById("profEmail").innerText;
var accordion = document.getElementsByClassName("accordion")[0];

let student_list;
let url = `${CURRENT_URL}/user/getStudents/professor/${profEmail}`;


function sendMessageBtp(e, idx) {
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

  applyStatus();
}

function sendMessageIp(e, idx) {
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

  applyStatus();
}

function btpApproved(e, idx) {
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

  applyStatus();
}

function ipApproved(e, idx) {
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

  applyStatus();
}

function addAcceptIPCode(student, obj, msg, idx) {
  return `
      <div class="accordion-item filter-btech">
        <button id="accordion-button-1" aria-expanded="false">
            <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${obj.projectName}</span> - <span class="tag tag-secondary">IP/IS/UR</span></span>
            <span class="icon" aria-hidden="true"></span>
            
        </button>
        <div class="accordion-content">
          <div>
            <i style='color:red;'>Please Inform the No Dues Department in-case you want to reject this Request!</i><br>  
            
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
          <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${obj.projectName}</span> - <span class="tag tag-secondary">BTP</span></span>
          <span class="icon" aria-hidden="true"></span>
          
      </button>
      <div class="accordion-content">

        <i style='color:red;'>Please Inform the No Dues Department in-case you want to reject this Request!</i><br>  
      
       
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
                <span class="accordion-title">${student.email} - ${student.roll} - ${student.name} - <span class="tag tag-primary">${obj.projectName}</span> - <span class="tag tag-secondary">BTP</span></span>
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

//Filtering accroding to status and type
function check(student) {
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

//Filtering according to degree, batch etc and then going to filtering by status and type
function clickFilter() {
  var degree = document.getElementById("degree").value;
  var department = document.getElementById("department").value;
  var batch = document.getElementById("batch").value;
  var type = document.getElementById("ip/btp").value;
  if (!batch) {
    batch = -1;
  }
  var status = document.getElementById("status").value;
  var currentList = [];

  for (var i in student_list) {
    student = student_list[i];

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
  currentList.map(check);
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

//Status Function

function applyStatus(){
  var status = document.getElementById("status").value;
  var request = new XMLHttpRequest();
  request.open("GET", url + "/" + status, false);
  request.send(null);
  if (request.status === 200) {
    student_list = JSON.parse(request.responseText);
    clickFilter();
  }
}

applyStatus();

//OnClick functions for search and status button

  var search = document.getElementById("search");
  search.addEventListener("click", clickFilter);

  var status_button = document.getElementById("status");
  status_button.addEventListener("click",applyStatus);


//SelectAll functionality
var selectAll = document.getElementById("selectAll");
selectAll.addEventListener("click", () => {
  var checkboxes = document.getElementsByClassName("tickbox");
  for (var i in checkboxes) {
    checkboxes[i].checked = true;
  }
});

//UnselectAll functionality
var unselectAll = document.getElementById("unselectAll");
unselectAll.addEventListener("click", () => {
  var checkboxes = document.getElementsByClassName("tickbox");
  for (var i in checkboxes) {
    checkboxes[i].checked = false;
  }
});

//code for sending multiple students at a time
var sendSelected = document.getElementById("sendAll");
sendSelected.addEventListener("click", () => {
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

      projectName=projectName.substring(sindex+1,eindex);
     
      var admin = list[list.length - 1];
      var eindex = admin.indexOf("</span>");
      var sindex = admin.indexOf(">");
      admin=admin.substring(sindex+1,eindex);
      
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

  applyStatus();

  
});
