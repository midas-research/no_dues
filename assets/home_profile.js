var user = JSON.parse(document.getElementById("user").innerHTML);
const CURRENT_URL = JSON.parse(
  document.getElementById("CURRENT_URL").innerHTML
);

//Profile Button
var homebtn = document.getElementById("home");
homebtn.addEventListener("click", () => {
  var obj = {};
  obj.user = JSON.stringify(user);

  window.location.href = `${CURRENT_URL}/`;
});

//Personal Details
var submitPersonalDetails = document.getElementById("submitPersonalDetails");
// var editPersonalDetails = document.getElementById("editPersonalDetails");
var personalMobile,
  personalEmail,
  leavingDate,
  leavingReason,
  completed,
  withdrawal;

function submitPersonalForm(event) {
  event.preventDefault();
  let personalDetails={};
  personalMobile = document.getElementById("personalMobile").value;
  personalEmail = document.getElementById("personalEmail").value;
  leavingDate = document.getElementById("leavingDate").value;
  withdrawal = document.getElementById("withdrawal");
  completed = document.getElementById("completed");
  
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

  var request = new XMLHttpRequest();
  request.open("POST", `${CURRENT_URL}/sendPersonalDetails`, false);
  request.setRequestHeader("Content-Type", "application/json");

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      // console.log(request.responseText);
    }
  };
  request.send(JSON.stringify(personalDetails));

  window.location.href = `${CURRENT_URL}/profile`;

};

function updatePersonalDetails(){

  personalMobile = document.getElementById("personalMobile");
  personalEmail = document.getElementById("personalEmail");
  leavingDate = document.getElementById("leavingDate");
  withdrawal = document.getElementById("withdrawal");
  completed = document.getElementById("completed");
  
  if (user[0].reason_of_leaving == "withdrawal") {
    withdrawal.checked = true;
    completed.checked = false;
    console.log("Yes");
  } else if (user[0].reason_of_leaving == "completed") {
    withdrawal.checked = false;
    completed.checked = true;
  }

  if (user[0].mobile != undefined) {
    personalMobile.value = user[0].mobile;
    personalEmail.value = user[0].other_email;  
    leavingDate.value = user[0].date_of_leaving;
    submitPersonalDetails.innerHTML='Save Changes';
    
  }
  
}
//Bank Details

var submitBankDetails = document.getElementById(
  "submitBankDetails"
);

var bankName, bankBranch, bankAccountNo, bankIfscCode, bankAccountHolder;

function submitBankForm(event) {
  event.preventDefault();

  bankName = document.getElementById("bankName").value;
  bankBranch = document.getElementById("bankBranch").value;
  bankAccountNo = document.getElementById("bankAccountNo").value;
  bankIfscCode = document.getElementById("bankIfscCode").value;
  bankAccountHolder = document.getElementById("bankAccountHolder").value;
  cancelledCheque=document.getElementById("cancelledCheque").value;
  
  var bankDetails = {};
  bankDetails.bankName = bankName;
  bankDetails.bankBranch = bankBranch;
  bankDetails.bankAccountNo = bankAccountNo;
  bankDetails.bankIfscCode = bankIfscCode;
  bankDetails.bankAccountHolder = bankAccountHolder;
  bankDetails.email = user[0]["email"];
  bankDetails.cancelledCheque=cancelledCheque;
  var request = new XMLHttpRequest();
 
  request.open(
    "POST",
    `${CURRENT_URL}/sendBankDetails`,false );
  request.setRequestHeader("Content-Type", "application/json");
  
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      // console.log(request.responseText);
    }
  };
  request.send(JSON.stringify(bankDetails)); 

  window.location.href = `${CURRENT_URL}/profile`;

};

function updateBankDetails() {

  bankName = document.getElementById("bankName").value;
  bankBranch = document.getElementById("bankBranch").value;
  bankAccountNo = document.getElementById("bankAccountNo").value;
  bankIfscCode = document.getElementById("bankIfscCode").value;
  bankAccountHolder = document.getElementById("bankAccountHolder").value;
  cancelledCheque = document.getElementById("cancelledCheque").value;
  
  if (user[0].bankName != undefined) {
    document.getElementById("bankName").value = user[0].bankName;
    document.getElementById("bankBranch").value = user[0].bankBranch; 
    document.getElementById("bankAccountNo").value = user[0].bankAccountNo;
    document.getElementById("bankIfscCode").value = user[0].bankIfscCode;
    document.getElementById("bankAccountHolder").value =user[0].bankAccountHolder;
    document.getElementById("cancelledCheque").value=user[0].cancelledCheque;

    submitBankDetails.innerHTML='Save Changes';
    
  }
 
};

updateBankDetails();
updatePersonalDetails();



