const CURRENT_URL = JSON.parse(document.getElementById("url").innerHTML);

var user = JSON.parse(document.getElementById("user").innerHTML);

var date = document.getElementById("date");
var today = new Date();
date.innerHTML =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

// Add Admin To Certificate
let admins_list;

var request = new XMLHttpRequest();
request.open("GET", `${CURRENT_URL}/user/getAdmins`, false);
request.send(null);
if (request.status === 200) {
  admins_list = JSON.parse(request.responseText);
}

tabledata = document.getElementById("contentTable");

tabledata.innerHTML += `
                    <tr>
                        <th>Sl. No.</th>
                        <th>Department / Cell / Section</th>
                        <th>Office</th>
                        <th>No Dues</th>
                        <th>Signature</th>
                    </tr>`;

let count = 0;

for (var i in admins_list) {
  let adminObj;
  var request = new XMLHttpRequest();

  let adminName=admins_list[i];
  if(adminName=='academics'){
    adminName+=user['degree'][0];
  }
  request.open("GET", `${CURRENT_URL}/user/getAdmin/${adminName}`, false);
  request.send(null);
  if (request.status === 200) {
    adminObj = JSON.parse(request.responseText)[0];
  }

  
  let originalName = adminObj["originalAdminName"];
  let displayAddress = adminObj["displayAddress"];
  let displayName = adminObj["displayName"];
  let clearance;
  if (user[admins_list[i]] == true) {
    clearance = "Yes";
  } else {
    clearance = "No";
  }
  count += 1;
  tabledata.innerHTML += `<tr>
                    <td>${count}</td>
                    <td>${originalName}</td>
                    <td>${displayAddress}</td>
                    <td>${clearance}</td>
                    <td>${displayName}</td>
                </tr>`;
}

for (var i in user["ipList"]) {
  let originalName = "IP/IS/UR";
  let displayAddress = "";
  let displayName;
  let professorEmail = user["ipList"][i]["profEmail"];

  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/user/getProfessorName/${professorEmail}`,
    false
  );
  request.send(null);
  if (request.status === 200) {
    displayName = JSON.parse(request.responseText);
  }

  let clearance;
  if (user["ipList"][i]["ip"]) {
    clearance = "Yes";
  } else {
    clearance = "No";
  }
  count += 1;

  tabledata.innerHTML += `<tr>
                    <td>${count}</td>
                    <td>${originalName}</td>
                    <td>${displayAddress}</td>
                    <td>${clearance}</td>
                    <td>${displayName}</td>
                </tr>`;
}

for (var i in user["btpList"]) {
  let originalName = "BTP/Scholary Paper/Thesis";
  let displayAddress = "";
  let displayName;
  let professorEmail = user["btpList"][i]["profEmail"];
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    `${CURRENT_URL}/user/getProfessorName/${professorEmail}`,
    false
  );
  request.send(null);
  if (request.status === 200) {
    displayName = JSON.parse(request.responseText);
  }

  let clearance;
  if (user["btpList"][i]["btp"]) {
    clearance = "Yes";
  } else {
    clearance = "No";
  }
  count += 1;
  tabledata.innerHTML += `<tr>
                    <td>${count}</td>
                    <td>${originalName}</td>
                    <td>${displayAddress}</td>
                    <td>${clearance}</td>
                    <td>${displayName}</td>
                </tr>`;
}

//QR CODE

let link = `${CURRENT_URL}/download/${user._id}`;

var qrcode = new QRCode(document.querySelector(".qrCode"), {
  text: link,
  width: 100, //128
  height: 100,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

let a = document.getElementById("atag");
a.setAttribute("href", link);

//PDF Download

var downloadbtn = document.getElementById("download");
if(screen.width>768){
  downloadbtn.addEventListener("click", download2);
}
else{
  console.log(screen.width);
  downloadbtn.addEventListener("click", download3);
}


function download1() {
  let doc = new jsPDF("p", "pt", "a4");
  var content = document.getElementById("body");
  doc.addHTML(content, function () {
    doc.save("No-Dues.pdf");
  });
}
function download2() {
  downloadbtn.style.opacity = 0;
  downloadbtn.style.display = "none";  
  var form=document.getElementById('form');
  let prev = form.style.width;
  form.style.width="678px";
  window.print();
  form.style.width = prev;
  downloadbtn.style.opacity = 1;
  downloadbtn.style.display = "block";
}
function download3() {
  downloadbtn.style.opacity = 0;
  downloadbtn.style.color='white';
  downloadbtn.style.display = "none";
  window.print();
   downloadbtn.style.color = "black";
  downloadbtn.style.opacity = 1;
  downloadbtn.style.display = "block";
}
