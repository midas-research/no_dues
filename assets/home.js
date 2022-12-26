var user = JSON.parse(document.getElementById("user").innerHTML);
const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
let professorsList;
let admins_list;

var request = new XMLHttpRequest();
request.open("GET", `${CURRENT_URL}/user/getProfessors`, false);
request.send(null);
if (request.status === 200) {
  professorsList = JSON.parse(request.responseText);
}

var request = new XMLHttpRequest();
request.open("GET", `${CURRENT_URL}/user/getAdmins`, false);
request.send(null);
if (request.status === 200) {
  admins_list = JSON.parse(request.responseText);
}


//Displaying Count
{
  let count = 0;

  for (var i in admins_list) {
    if (user[0][admins_list[i]] == true) {
      count += 1;
    }
  }
  for (var i in user[0]["ipList"]) {
    if (i["ip"] == true) {
      count += 1;
    }
  }
  for (var i in user[0]["btpList"]) {
    if (i["btp"] == true) {
      count += 1;
    }
  }
  var total = 0;

  total +=
    admins_list.length+
    user[0]["ipList"].length +
    user[0]["btpList"].length;

  document.getElementById("countCleared").innerHTML = `${count}`;
  document.getElementById("countAll").innerHTML = `${total}`;
}

var container = document.getElementById("admins_list_container");

//Creating request div
function createRequest(admin) {
  

  let adminName=admin;
  if(adminName=='academics'){
    adminName+=user[0]['degree'][0];
  }

  let details = {};
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getAdmin/${adminName}`, false);
  request.send(null);
  if (request.status === 200) {
    details = JSON.parse(request.responseText)[0];
  }
  let originalName = details["originalAdminName"];
  let displayName = details["displayName"];
  let displayAddress = details["displayAddress"];
  if (displayAddress == "") {
    displayAddress = "NA";
  }
  

  container.innerHTML += `<div class="accordion-item">
    <button id="row accordion-button-1" aria-expanded="false">
        <span class="accordion-title">${originalName}</span>
               
        <i class="fas fa-share request ${
          admin + "Symbol"
        } " onclick="requestFunction(event)" data-toggle="tooltip" data-placement="bottom" title="Send Request"></i>
        
        <span class="icon" aria-hidden="true"></span>

    </button>

    <div class="accordion-content">
        ${customInfo(admin)}        
        <p>Admin - ${displayName} [${displayAddress}]</p>
        <p id="${
          admin + "Message"
        }" class="message">There are no comments from the admin of this department.</p>
    </div>
  </div>`;
}

//Custom requirement of each admin
function customInfo(admin) {
  if (user[0][admin + "Applied"]) {
    return "";
  }
  if (admin == "hostel") {
    return `<br>
            Did you ever take hostel?
            <br>
            <input type="radio" id="taken" name="hostelTaken" value=true>
            <label for="taken">Yes</label><br>
            <input type="radio" id="notTaken" name="hostelTaken" value=false>
            <label for="notTaken">No </label><hr>`;
  } else {
    return "";
  }
}

//Creating requests for each admin
admins_list.map(createRequest);

//Symbol Update for Admins
function updateSymbolMessage(user, admin) {
  
  var symbol = document.getElementsByClassName(admin + "Symbol")[0];

  if (user[0][admin + "Message"] && !user[0][admin]) {
    document.getElementById(admin + "Message").innerHTML =
      user[0][admin + "Message"];
    symbol.classList.remove("fa-share");
    symbol.classList.remove("request");
    symbol.classList.add("send_request");
    symbol.classList.remove("fa-spinner");
    symbol.classList.add("fa-times-circle");
    symbol.setAttribute("title", "Not Cleared");
  } else if (user[0][admin + "Applied"] && !user[0][admin]) {
    var symbol = document.getElementsByClassName(admin + "Symbol")[0];
    symbol.classList.remove("fa-share");
    symbol.classList.remove("request");
    symbol.classList.add("send_request");
    symbol.classList.add("fa-spinner");
    symbol.setAttribute("title", "Pending");
  } else if (user[0][admin + "Applied"] && user[0][admin] == true) {
    if (symbol.classList.contains("fa-spinner")) {
      symbol.classList.remove("fa-spinner");
      symbol.classList.add("fa-check-circle");
      symbol.setAttribute("title", "Cleared");
    } else if (symbol.classList.contains("fa-times-circle")) {
      symbol.classList.remove("fa-times-circle");
      symbol.classList.add("fa-check-circle");
      symbol.setAttribute("title", "Cleared");
    } else if (symbol.classList.contains("fa-share")) {
      symbol.classList.remove("fa-share");
      symbol.classList.remove("request");
      symbol.classList.add("send_request");
      symbol.classList.add("fa-check-circle");
      symbol.setAttribute("title", "Cleared");
    }
    document.getElementById(admin + "Message").innerHTML =
      "Dues for this department has been approved";
  }
}

for (var i in admins_list) {
  updateSymbolMessage(user, admins_list[i]);
}

//To get admin name
function getAdminName(s) {
  if (s.substring(0, 9) == "Academics") {
    return "academics";
  }
  var arr = s.split(" ");
  var newName = arr[0].toLowerCase();
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] == "&" || arr[i] == "&amp;") {
      arr[i] = "and";
    }
    newName = newName + arr[i][0].toUpperCase() + arr[i].substring(1);
  }
  return newName;
}

//Sending Request
function requestFunction(event) {
  event.stopPropagation();
  var list = event.target.classList;
  if (list.contains("request") == false) {
    return;
  }
  var adminName = getAdminName(event.target.previousElementSibling.innerHTML);

  if (user[0][adminName + "Applied"]) {
    alert("You have already requested!");
    return;
  }

  let hostelTaken = undefined;

  if (adminName == "hostel") {
    var ele = document.getElementsByName("hostelTaken");

    for (i = 0; i < ele.length; i++) {
      if ((ele[i].type = "radio")) {
        if (ele[i].checked) {
          hostelTaken = ele[i].value;
          break;
        }
      }
    }

    if (hostelTaken == undefined) {
      alert("Please tell your hostel status! ");
      return;
    }
  }

  var obj = [];
  obj.push({
    studentEmail: user[0].email,
    adminName: adminName,
    hostelTaken: hostelTaken,
  });
  window.location.href = `${CURRENT_URL}/request/${JSON.stringify(obj)}`;
}

function applyToggle() {
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

//Professor BTP and IP Request

let ipCount = 0;
let btpCount = 0;

//Logic for Sending IP/BTP Requests

var professorsEmail = {};
var professorsName = {};

for (var i in professorsList) {
  professorsEmail[professorsList[i][0]] = professorsList[i][1];
  professorsName[professorsList[i][1]] = professorsList[i][0];
}

function sendBtpRequest(num) {
  var btp_proff = document.getElementsByClassName(`btp_proff${num}`)[0];
  var projectDescription = document.getElementById(
    `btpProjectDescription${num}`
  );
  var projectName = document.getElementById(`btpProjectName${num}`);

  if (btp_proff.value == "None" || btp_proff.value == "") {
    alert("Kindly choose a professor!");
    return;
  }

  if (projectName.value == "None" || projectName.value == "") {
    alert("Kindly Enter Project Name!");
    return;
  }
  if (projectDescription.value == "None" || projectDescription.value == "") {
    alert("Kindly Enter Project Description!");
    return;
  }
  var obj = [];
  obj.push({
    admin: "btp",
    profEmail: btp_proff.value,
    studentEmail: user[0]["email"],
    projectName: projectName.value,
    projectDescription: projectDescription.value,
  });

  window.location.href = `${CURRENT_URL}/sendBtpRequest/${JSON.stringify(obj)}`;
}

function sendIpRequest(num) {
  var ip_proff = document.getElementsByClassName(`ip_proff${num}`)[0];
  var projectDescription = document.getElementById(
    `ipProjectDescription${num}`
  );
  var projectName = document.getElementById(`ipProjectName${num}`);

  if (ip_proff.value == "None" || ip_proff.value == "") {
    alert("Kindly choose a professor!");
    return;
  }

  if (projectName.value == "None" || projectName.value == "") {
    alert("Kindly Enter Project Name!");
    return;
  }
  if (projectDescription.value == "None" || projectDescription.value == "") {
    alert("Kindly Enter Project Description!");
    project;
  }
  var obj = [];
  obj.push({
    admin: "ip",
    profEmail: ip_proff.value,
    studentEmail: user[0]["email"],
    projectName: projectName.value,
    projectDescription: projectDescription.value,
  });

  window.location.href = `${CURRENT_URL}/sendIpRequest/${JSON.stringify(obj)}`;
}

function createIpRequest() {
  ipCount += 1;
  container.innerHTML += `
  <div class="accordion-item">
      <button id="accordion-button-11" aria-expanded="false">
        <span class="accordion-title">IP / IS / UR</span>
        <i class="fas fa-share request ip_signal" data-toggle="tooltip" data-placement="bottom" onclick="sendIpRequest(ipCount)" title="Send Request"></i>
        <span class="icon" aria-hidden="true"></span>
      </button>

      <div class="accordion-content">
          <label for="proffs">Choose professor:  </label>
          
          <select name="proffs" class="ip_proff${ipCount}">
            <option value="None">None</option>
          </select>                    
          <br>
          
          <label  for="projectName">Project Name: 
            <input type="text" id="ipProjectName${ipCount}" class="form-control" placeholder="Enter Project Name">
          </label>
          <br>
          
          <label for="projectDescription">Project Description:
            <textarea class="form-control" id="ipProjectDescription${ipCount}" rows="3" cols="30" ></textarea>
          </label>    
      </div>
  </div>`;

  var ip_proff = document.getElementsByClassName(`ip_proff${ipCount}`)[0];
  for (var i in professorsList) {
    var newOption = document.createElement("option");
    var optionText = document.createTextNode(
      `${professorsList[i][0]} (${professorsList[i][1]})`
    );
    newOption.appendChild(optionText);
    newOption.setAttribute("value", professorsList[i][1]);
    ip_proff.appendChild(newOption);
  }
  total += 1;
  document.getElementById("countAll").innerHTML = `${total}`;

  applyToggle();
}

function createBtpRequest() {
  btpCount += 1;
  container.innerHTML += `
  <div class="accordion-item">
    <button id="accordion-button-11" aria-expanded="false">
      <span class="accordion-title">BTP / Scholarly Paper / Thesis</span>
      <i class="fas fa-share request btp_signal btp_sendRequest" data-toggle="tooltip" onclick="sendBtpRequest(btpCount)" data-placement="bottom" title="Send Request"></i>
      <span class="icon" aria-hidden="true"></span>
    </button>

    <div class="accordion-content">
        <label for="proffs">Choose professor:</label>
        <select name="proffs" class="btp_proff${btpCount}">
          <option value="None">None</option>
        </select>        
        <br>
        
        <label  for="projectName">Project Name: 
          <input type="text" id="btpProjectName${btpCount}" class="form-control" placeholder="Enter Project Name">
        </label>
        <br>
        
        <label for="projectDescription">Project Description:
          <textarea class="form-control" id="btpProjectDescription${btpCount}" rows="3" cols="30" ></textarea>
        </label>
        
    </div>
  </div> `;
  var btp_proff = document.getElementsByClassName(`btp_proff${btpCount}`)[0];
  for (var i in professorsList) {
    var newOption = document.createElement("option");
    var optionText = document.createTextNode(
      `${professorsList[i][0]} (${professorsList[i][1]})`
    );
    newOption.appendChild(optionText);
    newOption.setAttribute("value", professorsList[i][1]);
    btp_proff.appendChild(newOption);
  }
  applyToggle();
  total += 1;
  document.getElementById("countAll").innerHTML = `${total}`;
}

function createIpSentRequest(obj) {
  let msg = "No Comment";
  let signal = "fa-spinner";
  let color = "blue";
  let title = "Pending";

  if (obj["ip"] == false) {
    signal = "fa-times-circle";
    color = "red";
    title = "Rejected";
    msg = obj["ipMessage"];
  } else if (obj["ip"] == true) {
    signal = "fa-check-circle";
    color = "green";
    title = "Cleared";
    msg = "Your dues has been approved!";
  }

  container.innerHTML += `
    <div class="accordion-item">
      <button id="accordion-button-11" aria-expanded="false">
        <span class="accordion-title"> IP / IS / UR - <span class="tag tag-primary">${
          obj["projectName"]
        }</span> - <span class="tag tag-secondary">${
    professorsName[obj["profEmail"]]
  }</span></span>
        <i style="color: ${color};" class="send_request fas ${signal} " data-toggle="tooltip" data-placement="bottom" title="${title}"></i>
        <span class="icon" aria-hidden="true"></span>
      </button>

      <div class="accordion-content">
        Description:
            <ul>
                <li>Project Name: ${obj["projectName"]}</li>
                <li>Project Description: ${obj["projectDescription"]}</li>
            </ul>
        <hr>
        Comments:
        <br>
        ${msg}          
      </div>
  </div>`;
  applyToggle();
}

function createBtpSentRequest(obj) {
  let msg = "No Comment";
  let signal = "fa-spinner";
  let color = "blue";
  let title = "Pending";

  if (obj["btp"] == false) {
    signal = "fa-times-circle";
    color = "red";
    title = "Rejected";
    msg = obj["btpMessage"];
  }
  if (obj["btp"] == true) {
    signal = "fa-check-circle";
    color = "green";
    title = "Cleared";
    msg = "Your dues has been approved!";
  }

  container.innerHTML += `
    <div class="accordion-item">
      <button id="accordion-button-11" aria-expanded="false">
        <span class="accordion-title"> BTP / Scholarly Paper / Thesis - <span class="tag tag-primary">${
          obj["projectName"]
        }</span> - <span class="tag tag-secondary">${professorsName[obj["profEmail"]]}</span></span>
        <i style="color: ${color};" class="send_request fas ${signal}" data-toggle="tooltip" data-placement="bottom" title="${title}"></i>
        <span class="icon" aria-hidden="true"></span>
      </button>

      <div class="accordion-content">
          Description: 
            <ul>
                <li>Project Name: ${obj["projectName"]}</li>
                <li>Project Description: ${obj["projectDescription"]}</li>
            </ul>
          <hr>          
          Comments:
          <br>
          ${msg}         
      </div>
  </div>`;
  applyToggle();
}

if (user[0]["ipList"].length == 0) {
  createIpRequest();
}
if (user[0]["btpList"].length == 0) {
  createBtpRequest();
}

//Adding Already Sent Requests
user[0]["ipList"].map(createIpSentRequest);
user[0]["btpList"].map(createBtpSentRequest);

//Accordian Button

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
applyToggle();

setInterval(() => {
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getUser/${user[0]._id}`, false);
  request.send(null);
  if (request.status === 200) {
    user = [];
    user.push(JSON.parse(request.responseText));
  }

  for (var i in admins_list) {
    updateSymbolMessage(user, admins_list[i]);
  }
}, 3000);

//Download Button
var downloadbtn = document.getElementById("downloadbtn");
downloadbtn.addEventListener("click", () => {
  var obj = {};
  obj.student = user[0];

  var c = 0;
  for (var i in admins_list) {
    if (user[0][admins_list[i]] == false) {
      c = c + 1;
    }
  }

  window.location.href = `${CURRENT_URL}/download/${user[0]._id}`;
});

//Form Details (Bank And Personal)
{
  var modal = document.getElementById("myModal");
  var modal1 = document.getElementById("myModal1");
  var closeModal = document.getElementsByClassName("close")[0];
  var closeModal1 = document.getElementsByClassName("close1")[0];
  var submitModal = document.querySelector('.modal input[type="submit"]');
  var submitModal1 = document.querySelector('.modal1 input[type="submit"]');
  var bankName, bankBranch, bankAccountNo, bankIfscCode, bankAccountHolder;
  document.getElementById("bankName").onkeypress = function () {
    document.getElementById("bankNameWarning").style.display = "none";
  };
  document.getElementById("bankBranch").onkeypress = function () {
    document.getElementById("bankBranchWarning").style.display = "none";
  };
  document.getElementById("bankAccountNo").onkeypress = function () {
    document.getElementById("bankAccountNoWarning").style.display = "none";
  };
  document.getElementById("bankAccountHolder").onkeypress = function () {
    document.getElementById("bankAccountHolderWarning").style.display = "none";
  };
  document.getElementById("bankIfscCode").onkeypress = function () {
    document.getElementById("bankIfscCodeWarning").style.display = "none";
  };
  var personalMobile,
    personalEmail,
    leavingDate,
    leavingReason,
    completed,
    withdrawal;
  document.getElementById("personalMobile").onkeypress = function () {
    document.getElementById("personalMobileWarning").style.display = "none";
  };
  document.getElementById("personalEmail").onkeypress = function () {
    document.getElementById("personalEmailWarning").style.display = "none";
  };
  document.getElementById("leavingDate").onkeypress = function () {
    document.getElementById("leavingDateWarning").style.display = "none";
  };
  document.getElementById("completed").onclick = function () {
    document.getElementById("leavingReasonWarning").style.display = "none";
  };
  document.getElementById("withdrawal").onclick = function () {
    document.getElementById("leavingReasonWarning").style.display = "none";
  };
  submitModal.onclick = function () {
    bankName = document.getElementById("bankName").value;
    bankBranch = document.getElementById("bankBranch").value;
    bankAccountNo = document.getElementById("bankAccountNo").value;
    bankIfscCode = document.getElementById("bankIfscCode").value;
    bankAccountHolder = document.getElementById("bankAccountHolder").value;
    var c = 0;
    if (bankName == "") {
      document.getElementById("bankNameWarning").style.display = "block";
      c++;
    }
    if (bankBranch == "") {
      document.getElementById("bankBranchWarning").style.display = "block";
      c++;
    }
    if (bankAccountNo == "") {
      document.getElementById("bankAccountNoWarning").style.display = "block";
      c++;
    }
    if (bankIfscCode == "") {
      document.getElementById("bankIfscCodeWarning").style.display = "block";
      c++;
    }
    if (bankAccountHolder == "") {
      document.getElementById("bankAccountHolderWarning").style.display =
        "block";
      c++;
    }
    if (c > 0) {
      return;
    }
    var bankDetails = {};
    bankDetails.bankName = bankName;
    bankDetails.bankBranch = bankBranch;
    bankDetails.bankAccountNo = bankAccountNo;
    bankDetails.bankIfscCode = bankIfscCode;
    bankDetails.bankAccountHolder = bankAccountHolder;
    bankDetails.email = user[0]["email"];
    window.location.href = `${CURRENT_URL}/sendBankDetails/${JSON.stringify(
      bankDetails
    )}`;
    modal.style.display = "none";
  };
  submitModal1.onclick = function () {
    personalMobile = document.getElementById("personalMobile").value;
    personalEmail = document.getElementById("personalEmail").value;
    leavingDate = document.getElementById("leavingDate").value;
    withdrawal = document.getElementById("withdrawal");
    completed = document.getElementById("completed");
    var c = 0;
    if (personalMobile == "") {
      document.getElementById("personalMobileWarning").style.display = "block";
      c++;
    }
    if (personalEmail == "") {
      document.getElementById("personalEmailWarning").style.display = "block";
      c++;
    }
    if (leavingDate == "") {
      document.getElementById("leavingDateWarning").style.display = "block";
      c++;
    }
    if (!withdrawal.checked && !completed.checked) {
      document.getElementById("leavingReasonWarning").style.display = "block";
      c++;
    }
    if (c > 0) {
      return;
    }
    var personalDetails = {};
    personalDetails.personalMobile = personalMobile;
    personalDetails.personalEmail = personalEmail;
    personalDetails.leavingDate = leavingDate;

    if (withdrawal.checked) {
      personalDetails.leavingReason = "withdrawal";
    }
    if (completed.checked) {
      personalDetails.leavingReason = "completed";
    }

    personalDetails.email = user[0]["email"];
    window.location.href = `${CURRENT_URL}/sendPersonalDetails/${JSON.stringify(
      personalDetails
    )}`;
    modal1.style.display = "none";
  };

  // When the user clicks on the button, open the modal
  // window.onload = function () {
  //   if (
  //     !user[0]["bankName"] ||
  //     !user[0]["bankBranch"] ||
  //     !user[0]["bankAccountNo"] ||
  //     !user[0]["bankIfscCode"]
  //   ) {
  //     modal.style.display = "block";
  //   }
  // };
  var uploadBankDetails = document.getElementById("uploadBankDetails");
  uploadBankDetails.onclick = function () {
    modal.style.display = "block";
    if (user[0].bankName != undefined) {
      document.getElementById("bankName").value = user[0].bankName;
    }
    if (user[0].bankBranch != undefined) {
      document.getElementById("bankBranch").value = user[0].bankBranch;
    }
    if (user[0].bankAccountNo != undefined) {
      document.getElementById("bankAccountNo").value = user[0].bankAccountNo;
    }
    if (user[0].bankIfscCode != undefined) {
      document.getElementById("bankIfscCode").value = user[0].bankIfscCode;
    }
  };

  var uploadPersonalDetails = document.getElementById("uploadPersonalDetails");
  uploadPersonalDetails.onclick = function () {
    modal1.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  closeModal.onclick = function () {
    modal.style.display = "none";
  };
  closeModal1.onclick = function () {
    modal1.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target == modal1) {
      modal1.style.display = "none";
    }
  };
}


  
