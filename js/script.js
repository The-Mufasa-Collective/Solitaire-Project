// Grab the elements we need from HTML using their IDs
const modal = document.getElementById('instructions-modal');
const openBtn = document.getElementById('hint');
const closeBtn = document.getElementById('close-instructions');

// Show the pop-up when clicking the "Instructions" button
openBtn.addEventListener('click', function() {
  modal.classList.remove('hidden');
});

// Hide the pop-up when clicking the "Close" button
closeBtn.addEventListener('click', function() {
  modal.classList.add('hidden');
});

// Hide the pop-up if the user clicks anywhere outside the box (on the dark backdrop)
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});