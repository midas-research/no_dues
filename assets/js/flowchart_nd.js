function change_data() {
    modal.style.display = "block";
}

function change_flow() {

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
var closeModal = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}