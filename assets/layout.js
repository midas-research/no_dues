const navbar = document.getElementById("navbar");

var topIdx = navbar.offsetTop;
function stickynavbar() {
  if (window.scrollY > topIdx+(window.innerHeight/10)) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}
window.addEventListener("scroll", stickynavbar);
