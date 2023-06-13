const CURRENT_URL = JSON.parse(document.getElementById("url").innerHTML);

var user = JSON.parse(document.getElementById("user").innerHTML);

var date = document.getElementById("date");
var today = new Date();
date.innerHTML =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

// Add Admin To Certificate
let admins_list=[];
let admins_temp=[];

var request = new XMLHttpRequest();
request.open("GET", `${CURRENT_URL}/user/getAdmins`, false);
request.send(null);
if (request.status === 200) {
  admins_temp = JSON.parse(request.responseText);

  for (var i in admins_temp) {
    if(["adminECE","adminSSH","adminCSE","adminMaths","adminCB","adminHCD"].includes(admins_temp[i])){
      //skipping admin CSE, admin ECE etc.
      continue;
    }

    admins_list.push(admins_temp[i]);
  }
  admins_list.push(`admin${user['department']}`);
  
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
  if (user[admins_list[i]] == true || user['nodues']==true) {
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
downloadbtn.addEventListener("click", download2);

function download1() {
  let doc = new jsPDF("p", "pt", "a4");
  var content = document.getElementById("form");
  content.style.width = "678px";

  doc.addHTML(content, function () {
    doc.save("No-Dues.pdf");
  });
}
function download2() { 
  
  
  window.print();
  
  window.location.href = `${CURRENT_URL}/download/${user._id}`;
}

function download3() {
  var form = document.getElementById("form");
  let prev = form.style.width;
  form.style.width = "678px";

  html2canvas(form).then((canvas) => {     
   
    var pdf = new jsPDF("p", "pt", "a4");

    var h = canvas.height;     
    var w=  canvas.width;

    for (var i = 0; i <= h / 842; i++) {
      
      var srcImg = canvas;
      var sX = 0;
      var sY = 842 * i; 
      var sWidth = w;
      var sHeight = 842;
      var dX = 0;
      var dY = 0;
      var dWidth = 592;
      var dHeight = (842*600.0)/w;
      window.onePageCanvas = document.createElement("canvas");
      onePageCanvas.setAttribute("width", 592);
      onePageCanvas.setAttribute("height", 842);
      var ctx = onePageCanvas.getContext("2d");      
      ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
      var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
      var width = onePageCanvas.width;
      var height = onePageCanvas.clientHeight;
      if (i > 0) {
        pdf.addPage(592, 842); 
      }
      pdf.setPage(i + 1);
      pdf.addImage(canvasDataURL, "PNG", 20, 40, width*0.9 , height*0.9 );
    }
    pdf.save("No Dues.pdf");
    
  });
  form.style.width=prev;
  
  
}

        
  