const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);
var id = document.getElementById("id").innerHTML;

var home = document.getElementById("superAdminHome");
home.addEventListener("click", () => {
  window.location.href = `${CURRENT_URL}/super_admin`;
});

let iframe = document.getElementById("excel");
const studentURL = JSON.parse(
  document.getElementById("studentURL").innerHTML
);
const adminURL = JSON.parse(document.getElementById("adminURL").innerHTML);
const professorURL = JSON.parse(document.getElementById("professorURL").innerHTML);


var updateAccess = document.getElementById("updateAccess");
updateAccess.addEventListener("click", () => {
  var status = document.querySelectorAll(".active a")[0].getAttribute("id");
  var request = new XMLHttpRequest();
  request.open("GET", `${CURRENT_URL}/super_admin/update${status}`, false);
  request.send();
  if (request.status === 200) {
    console.log('success');
    new Noty({
      theme: "metroui",
      text: "Changes Saved",
      type: "success",
      layout: "topRight",
      timeout: 1500,
    }).show();
  }
});

var sheetAccess = document.getElementById("sheetAccess");
sheetAccess.addEventListener("click", () => {
  var status = document.querySelectorAll(".active a")[0].getAttribute("id");
  var url = JSON.parse(document.getElementById(`${status}URL`).innerHTML);
  new Noty({
    theme: "metroui",
    text: "Opening Sheet!",
    type: "success",
    layout: "topRight",
    timeout: 1500,
  }).show();
  window.open(url, "_blank");
});

function updateIframe(){
  var status = document.querySelectorAll(".active a")[0].getAttribute("id");
  var url=JSON.parse(document.getElementById(`${status}URL`).innerHTML);
  

  iframe.setAttribute(
    "src",
    `${url}?widget=true&amp;rm=minimal&amp;headers=false`
  );
}


var items = document.querySelectorAll(".nav-item");
items.forEach((item) => item.addEventListener("click", ()=>{
      new Noty({
        theme: "metroui",
        text: "Please Wait",
        type: "info",
        layout: "topRight",
        timeout: 1500,
      }).show();
      var ele =document.getElementsByClassName("active")[0];
      ele.classList.remove("active");
      item.classList.add("active");
      updateIframe();
    }
  )
);

updateIframe();

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
