const navbar = document.getElementById("navbar");
console.log(navbar);
var topIdx = navbar.offsetTop;
function stickynavbar() {
  if (window.scrollY > topIdx+1) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}
window.addEventListener("scroll", stickynavbar);
