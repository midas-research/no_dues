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

  let count = 0;

  for (var i in admins_list) {
    if (user[0][admins_list[i]] == true) {
      count += 1;
    }
  }
  for (var i in user[0]["ipList"]) {
    
    if (user[0]['ipList'][i]["ip"] == true) {
      
      count += 1;
    }
  }
  for (var i in user[0]["btpList"]) {
    if (user[0]["btpList"][i]["btp"] == true) {
      count += 1;
    }
  }
  var total = 0;

  total +=
    admins_list.length+
    user[0]["ipList"].length +
    user[0]["btpList"].length;

  // document.getElementById("countCleared").innerHTML = `${count}`;
  // document.getElementById("countAll").innerHTML = `${total}`;


var container = document.getElementsByClassName('requests-list')[0];

//Creating request div
function createRequest(admin) {
  let adminName = admin;
  if (adminName == "academics") {
    adminName += user[0]["degree"][0];
  }

  let details = {};
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/user/getAdmin/${adminName}`, false);
  request.send(null);
  if (request.status === 200) {
    details = JSON.parse(request.responseText)[0];
  
    let originalName = details["originalAdminName"];
    let displayName = details["displayName"];
    let displayAddress = details["displayAddress"];
    if (displayAddress == "") {
      displayAddress = "NA";
    }
    let displayMessage ="There are no comments from the admin of this department.";

    if(user[0][adminName+'Messgae']){
      displayMessage=user[0][adminName+'Message'];    
    }

    let displayFine ="NA";

    if (user[0][adminName + "Fine"]) {
      displayFine = user[0][adminName + "Fine"];
    }

    container.innerHTML += `
    <div class="accordion-item container">
      <button class="row" type="button" aria-expanded="false">

            <div class="accordion-title col-8">${originalName}</div>

            <div class="col-3 text-center"> 
              <div class="status-button btn request ${admin + 'Status'} " onclick="requestFunction(event)">Request </div> 
            </div>
            
            <div class="col-1 text-center">     
              <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
              <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
            </div>      
          
      </button>
      <div class="accordion-content row">

          <div class="accordion-body">

            ${customInfo(admin)}        
            <p>Admin :  ${displayName} [${displayAddress}]</p>
            <p>Message: <span class="${admin+'Message'}"> ${displayMessage}</span></p>
            <p>Fine: <span class="${admin+'Fine'}">${displayFine}</span></p>
          
          
          </div>
          
      </div>
    </div>`;
  }
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

//Status Update for Admins
function updateStatusMessage(user, admin) {
  var status = document.getElementsByClassName(admin + "Status")[0];

  //Rejected
  if (user[0][admin + "Message"] && !user[0][admin]) {

    let displayFine = "NA";
    if (user[0][admin + "Fine"]) {
      displayFine = user[0][admin + "Fine"];
    }

    document.getElementsByClassName(admin + "Message")[0].innerHTML = user[0][admin + "Message"];
    document.getElementsByClassName(admin + "Fine")[0].innerHTML = displayFine;
    status.classList.remove("request");
    status.classList.remove("accepted");
    status.classList.add("rejected");
    status.classList.remove("pending");
    status.innerHTML = "Rejected";
  }
  //Pending
  else if (user[0][admin + "Applied"] && !user[0][admin]) {    
    status.classList.remove("request");
    status.classList.remove("accepted");
    status.classList.remove("rejected");
    status.classList.add("pending");
    status.innerHTML = "Pending";
  } 
  
  //Accepted
  else if (user[0][admin + "Applied"] && user[0][admin] == true) {
    status.classList.remove("request");
    status.classList.add("accepted");
    status.classList.remove("rejected");
    status.classList.remove("pending");
  
    document.getElementsByClassName(admin + "Message")[0].innerHTML = "Dues for this department has been approved";
    document.getElementsByClassName(admin + "Fine")[0].innerHTML = "NA";
    status.innerHTML = "Accepted";
  }
}

for (var i in admins_list) {
  updateStatusMessage(user, admins_list[i]);
}

//Toggle Button
 function toggleAccordion() {
   const items = document.querySelectorAll(".accordion button");
   
   const itemToggle = this.getAttribute("aria-expanded");

   for (i = 0; i < items.length; i++) {
     items[i].setAttribute("aria-expanded", "false");
   }

   if (itemToggle == "false") {
     this.setAttribute("aria-expanded", "true");
   }
   
 }

function applyToggle(){
  const items = document.querySelectorAll(".accordion button");

  items.forEach((item) => item.addEventListener("click", toggleAccordion));
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
  
  var list = event.target.classList;
  
  if (list.contains("request") == false) {
    return;
  }
  var adminName = getAdminName(event.target.parentElement.previousElementSibling.innerHTML);
 

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
  <div class="accordion-item container">
      <button  class="row" type="button" aria-expanded="false">
        <div class="accordion-title col-8">IP / IS / UR </div>
        <div class="col-3 text-center"> 
            <div class="status-button btn request" onclick="sendIpRequest(ipCount)">Request </div> 
        </div>
        <div class="col-1 text-center">     
            <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
            <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
        </div>
      </button>

      <div class="accordion-content">
          
          <div class="accordion-body">
          
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
            <br>   
          </div>  
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
 
  applyToggle();
  
  
}

function createBtpRequest() {
  btpCount += 1;
  container.innerHTML += `
  <div class="accordion-item container">
    <button  class="row" type="button" aria-expanded="false">
      <div class="accordion-title col-8">BTP / Scholarly Paper / Thesis</div>
      <div class="col-3 text-center"> 
          <div class="status-button btn request" onclick="sendBtpRequest(btpCount)">Request </div> 
      </div>      
       
      <div class="col-1 text-center">     
          <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
          <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
      </div>
    </button>
    <div class="accordion-content">
        <div class="accordion-body">
          
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
          <br>  
        </div>
        
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
  
  total += 1;
  // document.getElementById("countAll").innerHTML = `${total}`;
  
  applyToggle();
}

function createIpSentRequest(obj) {
  let className="pending";
  let msg="No Message from the Professor";
  let status="Pending";


  if (obj["ip"] == false) {
    status = "Rejected";
    className = "rejected";
    msg = "Your dues has been approved!";
  } else if (obj["ip"] == true) {
    status = "Accepted";
    className='accepted';
    msg = "Your dues has been approved!";
  }

  container.innerHTML += `
    <div class="accordion-item container">

      <button  class="row" type="button" aria-expanded="false">
        <div class="accordion-title col-8">IP / IS / UR <span class="tag tag-primary">${obj["projectName"]}</span> <span class="tag tag-secondary">${professorsName[obj["profEmail"]]}</span> </div>
        <div class="col-3 text-center"> 
          <div class="status-button btn ${className}" onclick="sendIpRequest(ipCount)">${status} </div> 
        </div>         
        <div class="col-1 text-center">     
            <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
            <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
        </div>
      </button>      
      
      <div class="accordion-content">
        <div class="accordion-body">
          Description:
              <ul>
                  <li>Project Name: ${obj["projectName"]}</li>
                  <li>Project Description: ${obj["projectDescription"]}</li>
              </ul>
          <hr>
          Comments:
          <br>
          ${msg}
          <br>          
        </div>
      </div>
    </div>`;
  
}

function createBtpSentRequest(obj) {
  let className = "pending";
  let msg = "No Message from the Professor";
  let status = "Pending";

  if (obj["btp"] == false) {
    status = "Rejected";
    className = "rejected";
    msg = "Your dues has been approved!";
  } 
  else if (obj["btp"] == true) {
    status = "Accepted";
    className = "accepted";
    msg = "Your dues has been approved!";
  }

  container.innerHTML += `
    <div class="accordion-item container">
      
      <button  class="row" type="button" aria-expanded="false">
        <div class="accordion-title col-8">BTP / Scholarly Paper / Thesis <span class="tag tag-primary">${
          obj["projectName"]
        }</span>  <span class="tag tag-secondary">${
    professorsName[obj["profEmail"]]
  }</span></div>
        
        <div class="col-3 text-center"> 
          <div class="status-button btn ${className}" onclick="sendBtpRequest(btpCount)">${status} </div> 
        </div>
        
        <div class="col-1 text-center">     
            <i class="bi bi-caret-down-fill down" aria-hidden="true"></i>
            <i class="bi bi-caret-up-fill up" aria-hidden="true"></i>
        </div>
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
          <br>           
      </div>
    </div>`;  
}

//Adding Already Sent Requests or New Requests

if (user[0]["ipList"].length == 0) {
  createIpRequest();
}
else{
  user[0]["ipList"].map(createIpSentRequest);
}
if (user[0]["btpList"].length == 0) {
  createBtpRequest();
}
else{
  user[0]["btpList"].map(createBtpSentRequest);
}

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
    updateStatusMessage(user, admins_list[i]);
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


//Profile Button
var profilebtn = document.getElementById("profile");
profilebtn.addEventListener("click", () => {
  var obj = {};
  obj.user = JSON.stringify(user);

  window.location.href = `${CURRENT_URL}/profile`;
});

//Form Details (Donation)

  for (var i in admins_list) {
    let donationAdmin = document.getElementById("donationAdmin");
    let adminName = admins_list[i];
    if (adminName == "academics") {
      adminName += user[0]["degree"][0];
    }

    let details = {};
    var request = new XMLHttpRequest();
    request.open("GET", `${CURRENT_URL}/user/getAdmin/${adminName}`, false);
    request.send(null);
    if (request.status === 200) {
      details = JSON.parse(request.responseText)[0];
    }
    let originalName = details["originalAdminName"];

    var option = document.createElement("option");
    option.value = adminName;
    option.text = originalName;
    donationAdmin.add(option);
  }

  var submitDonationDetails = document.getElementById("submitDonationDetails");

  var donationAdmin, donationAmount;

   function submitDonationForm(event) {
    event.preventDefault();
    let donationDetails = {};
    donationAdmin = document.getElementById("donationAdmin").value;
    donationAmount = document.getElementById("donationAmount").value;

    
    donationDetails.donationAdmin = donationAdmin;
    donationDetails.donationAmount = donationAmount;
    donationDetails.email = user[0]["email"];

    var request = new XMLHttpRequest();
    request.open("POST", `${CURRENT_URL}/sendDonationDetails`, false);
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        // console.log(request.responseText);
      }
    };
    request.send(JSON.stringify(donationDetails)); 

    window.location.href = `${CURRENT_URL}/`;
  };

  function updateDonationDetails() {
    donationAdmin = document.getElementById("donationAdmin");
    donationAmount = document.getElementById("donationAmount");

    if (user[0].donationAdmin != 'None') {
      donationAdmin.value = user[0].donationAdmin;
      donationAmount.value = user[0].donationAmount;
      submitDonationDetails.innerHTML='Save Changes';
    }
  }

  updateDonationDetails();