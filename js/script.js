// Get elements by ID
const modal = document.getElementById('instructions-modal');
const openBtn = document.getElementById('hint');
const closeBtn = document.getElementById('close-instructions');

// Click Instructions button to show popup
openBtn.onclick = function() {
  modal.classList.remove('hidden');
};

// Click Close button to hide popup
closeBtn.onclick = function() {
  modal.classList.add('hidden');
};