// 1. Create variables to hold the raw time and the interval reference
let totalSeconds = 0;
let timerInterval = null;

// 2. This function does the math and updates what the user sees on screen
function updateTimerDisplay() {
    // Math.floor rounds down to get whole minutes
    let minutes = Math.floor(totalSeconds / 60);
    // The % (remainder) operator gets the leftover seconds after minutes are removed
    let seconds = totalSeconds % 60;

    // String().padStart(2, '0') makes sure single digits look like '05' instead of '5'
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');

    // Find the HTML element by its ID and change its inner text
    document.getElementById("timer").innerText = `${formattedMinutes}:${formattedSeconds}`;
}

// 3. This function starts the timer tracking loop
function startTimer() {
    // If a timer is already running, stop it first to prevent doubling speed
    if (timerInterval !== null) return;

    timerInterval = setInterval(function() {
        totalSeconds++;          // Add 1 to total seconds
        updateTimerDisplay();    // Refresh the screen display
    }, 1000);                    // 1000 milliseconds = repeat every 1 second
}

// 4. This function pauses the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null; // Reset the holder variable so it can be restarted later
}

// 5. This function resets the timer back to zero
function resetTimer() {
    stopTimer();
    totalSeconds = 0;
    updateTimerDisplay();
}

// Automatically start the timer when the script loads
updateTimerDisplay();
startTimer();
