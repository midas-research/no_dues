function change_data() {
    modal.style.display = "block";
}

function change_flow() {
    modal1.style.display = "block";
}

var data_img = document.getElementById('data_img');
var student_img = document.getElementById('student_img');

adminFlowchart = () => {
    data_img.style.display = 'none';
    student_img.style.display = 'block';
}
dataFlowchart = () => {
    data_img.style.display = 'block';
    student_img.style.display = 'none';
}

var modal = document.getElementById("myModal");
var modal1 = document.getElementById("myModal1");
var closeModal = document.getElementsByClassName("close")[0];
var closeModal1 = document.getElementsByClassName("close1")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  modal.style.display = "none";
}
closeModal1.onclick = function() {
  modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}