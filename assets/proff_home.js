const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
var profEmail = document.getElementById("profEmail").innerText;
var accordion = document.getElementsByClassName("accordion")[0];

let student_list;
let url = `${CURRENT_URL}/user/getStudents/professor/${profEmail}`;



// Rejection Functions
function sendMessageBtp(e, idx) {
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

//Functionality of reject button in accordion button

function clickAlternate(e){  
  let element=e.target.parentElement.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].childNodes[5];
  element.click();
}


//Approval Functions
function btpApproved(e, idx) {
  
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

//Request Element Adding Functions

function addAcceptIPCode(student, obj, msg, idx) {
  return `
    <div class="accordion-item container">
      <button class="row accordion-heading" type="button" aria-expanded="false">

            <div class="accordion-title col-11">${student.email} - ${student.roll} - ${student.name} <span class="tag tag-primary">${obj.projectName}</span> <span class="tag tag-secondary">IP/IS/UR</span></div>

            <div class="col-1 text-center">     
              <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
              <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
            </div>      
          
      </button>
      <div class="accordion-content ">

          <div class="accordion-body">
            <i style="color:red;">Please contact Nodues Department incase you want to reject this request.</i>

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

            
            <div class="accordion-title col-11">${student.email} - ${student.roll} - ${student.name} <span class="tag tag-primary">${obj.projectName}</span> <span class="tag tag-secondary">BTP</span></div>
            
            <div class="col-1 text-center">     
              <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
              <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
            </div>      
          
      </button>
      <div class="accordion-content ">

          <div class="accordion-body">
            <i style="color:red;">Please contact Nodues Department incase you want to reject this request.</i>
            
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
    </div>`;;
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
  return `
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


//Filtering accroding to status and type
function check(student) {
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

//Filtering according to degree, batch etc and then going to filtering by status and type
function clickFilter() {
  var degree = document.getElementById("degree").value;
  var department = document.getElementById("department").value;
  var batch = document.getElementById("batch").value;
  var type = document.getElementById("ip/btp").value;
  if (!batch) {
    batch = -1;
  }
  var status = document.getElementsByClassName("status")[0].id;
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
    } 
    else if (type == "btp") {
      for (var j in student["btpList"]) {
        obj = student["btpList"][j];
        if (obj["profEmail"] == profEmail) {
          currentList.push(student);
          break;
        }
      }
    } 
    else{
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

  currentList.map(check);


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

//Status Function
function applyStatus(){
  var status = document.getElementsByClassName("status")[0].id; 
  var request = new XMLHttpRequest();
  request.open("GET", url + "/" + status, false);
  request.send(null);
  if (request.status === 200) {
    student_list = JSON.parse(request.responseText);
    clickFilter();
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

//Adding requests with initial filters
applyStatus();

//OnClick functions for search and status button
const filters = document.querySelectorAll(".filter");
filters.forEach(function (btn) {
  btn.addEventListener("click", clickFilter);
});

document.getElementById("batchButton").addEventListener("click", clickFilter);


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
    if (checkboxes[i].checked == true) { 
      if(checkboxes[i].nextSibling){
        
        var obj = [];
        var text = checkboxes[i].parentElement.nextElementSibling.innerHTML;
        var list = text.split(" - ");

        var studentEmail = list[0];
        var project = list[list.length - 1];
        
        var eindex = project.indexOf("</span>");
        var sindex = project.indexOf(">");
        projectName = project.substring(sindex + 1, eindex);        

        var admin = project.substring(eindex+7,project.length);
        
        var eindex = admin.indexOf("</span>");
        var sindex = admin.indexOf(">");
        
        admin = admin.substring(sindex+1,eindex);
        
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

  
});
