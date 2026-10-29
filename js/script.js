// 1. Create variables to hold the raw time and the interval reference
let totalSeconds = 0;
let timerInterval = null;

// Turn seconds into a clock time, like 02:05.
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let leftoverSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(leftoverSeconds).padStart(2, '0')}`;
}

// 2. This function does the math and updates what the user sees on screen
function updateTimerDisplay() {
    // Find the HTML element by its ID and change its inner text
    document.getElementById("timer").innerText = formatTime(totalSeconds);
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

// Show the last saved score when the page opens.
let savedScore = localStorage.getItem("solitaireScore");
if (savedScore !== null) {
    document.getElementById("score").innerText = formatTime(Number(savedScore));
} else {
    document.getElementById("score").innerText = "00:00";
}

// Save this game's time, then start the next game from zero.
document.getElementById("restart").addEventListener("click", function() {
    localStorage.setItem("solitaireScore", totalSeconds);
    document.getElementById("score").innerText = formatTime(totalSeconds);
    resetTimer();
    startTimer();
});

// Automatically start the timer when the script loads
updateTimerDisplay();
startTimer();
