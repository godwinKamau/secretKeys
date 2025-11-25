// Modal structure taken from w3schools: https://www.w3schools.com/howto/howto_css_modals.asp


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementById("close");

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

let charCount = document.querySelector('#charCount')
let charCountNum = document.querySelector('textarea')

document.querySelector('#post').addEventListener('input', () => {
    charCount.innerText = ` ${300 - charCountNum.value.length}`
})