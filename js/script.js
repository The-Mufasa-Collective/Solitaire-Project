function loadTimeFromStorage() {
  let totalSeconds = localStorage.getItem("solitaireScore");
  if (totalSeconds == null) return;
  document.getElementById("score").innerText = formatTime(totalSeconds);
}

loadTimeFromStorage();

// create a fresh deck of cards and shuffles it
// color is implied by the suit
function createStartingDeck() {
  let deck = [];

  for (i = 1; i <= 13; i++) {
    deck.push({
      value: i,
      hidden: true,
      color: "black",
      suit: "spades",
    });
    deck.push({
      value: i,
      hidden: true,
      color: "red",
      suit: "hearts",
    });
    deck.push({
      value: i,
      hidden: true,
      color: "red",
      suit: "diamonds",
    });
    deck.push({
      value: i,
      hidden: true,
      color: "black",
      suit: "clubs",
    });
  }

  //shuffle deck
  let currentIndex = deck.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }

  return deck;
}
function getCardValue(value) {
  if (value === 1) return "A";
  else if (value === 11) return "J";
  else if (value === 12) return "Q";
  else if (value === 13) return "K";
  else return value;
}

function getSuitSymbol(suit) {
  if (suit == "hearts") return "♥";
  else if (suit == "spades") return "♠";
  else if (suit == "diamonds") return "♦";
  else if (suit == "clubs") return "♣";
}

function renderCard(card) {
  let cardElement = document.createElement("div");
  cardElement.setAttribute("id", `card-${card.suit}-${card.value}`);

  cardElement.setAttribute("class", `card ${card.color}`);
  cardElement.setAttribute("draggable", true);
  cardElement.textContent = `
            ${getCardValue(card.value)}
            ${getSuitSymbol(card.suit)}
        `;

  return cardElement;
}

function renderStock(gameDeck) {
  let stock = document.getElementById("stock");

  gameDeck.forEach((card) => {
    let cardElement = document.createElement("div");
    cardElement.setAttribute("id", `card-${card.suit}-${card.value}`);
    cardElement.setAttribute("class", `card ${card.color} stock-card`);
    cardElement.setAttribute("draggable", false);

    cardElement.object = card;

    stock.appendChild(cardElement);
  });
}

function prepareGameCards() {
  let gameDeck = createStartingDeck();

  // Distribute cards to columns:
  for (i = 1; i <= 7; i++) {
    let column = document.getElementById(`column${i}`);

    for (j = 1; j <= i; j++) {
      //Pick first card from deck
      const card = gameDeck.splice(0, 1)[0];
      let renderedCard = renderCard(card);
      renderedCard.classList.add("tableu-card");
      renderedCard.object = card;
      column.appendChild(renderedCard);
    }
  }
  // render the remaining card in the stock.
  renderStock(gameDeck);
}

prepareGameCards();

//FOUNDATION BEHAVIOR
//========================================================

const foundationPile = document.querySelectorAll(".foundation"); //holds the 4 foundation boxes

//checks if a card is an ace. takes one card and gives back true or false
function isAce(card) {
  if (card.object.value === 1) {
    //card.object.value is the number inside the card. ace has the no. 1
    return true;
  } else {
    return false;
  }
}

//checks if its the same suit as a foundation box. takes a card and a box and gives back true or false
function sameSuit(card, foundation) {
  if (card.object.suit === foundation.dataset.suit) {
    //card.object.suit is the suit inside the card.foundation.dataset.suit is the data-suit box in html
    return true;
  } else {
    return false;
  }
}

function goesOnFoundation(card, foundation) {
  //card on top of the box or null if the box is empty

  if (card.children.length > 0) return false;
  const topCard = foundation.lastElementChild;

  if (sameSuit(card, foundation)) {
    if (topCard === null) {
      //empty box, only ace is allowed
      if (isAce(card)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (card.object.value === topCard.object.value + 1) {
        // the card must be 1 higher than top card
        return true;
      } else {
        return false;
      }
    }
  } else {
    // not same suit
    return false;
  }
}

// does for each of the 4 foundation boxes
for (const foundation of foundationPile) {
  //runs when a card is held over this box.
  //e.preventDefault() says yes, you can drop here
  foundation.addEventListener("dragover", function (e) {
    if (selected !== null) {
      // when card is in hand
      if (goesOnFoundation(selected, foundation)) {
        e.preventDefault();
      }
    }
  });

  //happens when you drop card over this box
  foundation.addEventListener("drop", function (e) {
    if (selected !== null) {
      if (goesOnFoundation(selected, foundation)) {
        e.preventDefault();
        foundation.appendChild(selected); //move the card into the box
        selected.classList.add("foundation-card");
        selected.classList.remove("tableu-card");
        selected.classList.remove("waste-card");
        selected.classList.remove("stock-card");
        selected = null; //hand is emtpy now
        revealedCardDirection();
        checkForMoves();
        autoComplete();
        checkVictoryCondition(); // Check if the game has been won after a card is dropped in the foundation
      }
    }
  });
}

// does this for each 4 foundation boxes
for (const foundation of foundationPile) {
  //runs when start dragging something inside this box
  foundation.addEventListener("dragstart", function (e) {
    //e.target is the card you grabbed

    //lastElementChild is top card of this box
    if (e.target === foundation.lastElementChild) {
      selected = e.target; //it is the top card, allowed
    } else {
      selected = null; //it is a lower card, hold nothing
      e.preventDefault(); //cancel the drag
    }
  });
}

//DRAG AND DROP WITHIN TABLEU
//========================================================

const columns = document.querySelectorAll(".column");
let selected = null;
let selectedStack = [];

for (const column of columns) {
  column.addEventListener("dragstart", function (e) {
    if (
      e.target.closest(".tableu-card") === column.lastElementChild &&
      column.lastElementChild.children.length === 0
    ) {
      selected = e.target.closest(".tableu-card");
      selectedStack = [];
    } else if (
      column.lastElementChild.contains(e.target.closest(".tableu-card"))
    ) {
      selected = e.target.closest(".tableu-card");
      selectedStack = [];
    } else {
      selected = null;
      selectedStack = [];
      e.preventDefault();
    }
  });

  column.addEventListener("dragover", function (e) {
    if (column.children.length === 1 && selected?.object.value === 13) {
      e.preventDefault();
    } else if (
      e.target.closest(".tableu-card")?.object &&
      e.target.closest(".tableu-card")?.children.length === 0 &&
      selected?.object &&
      e.target.closest(".tableu-card").object.value ===
        selected.object.value + 1 &&
      e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
      e.preventDefault();
    }
  });

  column.addEventListener("drop", function (e) {
    if (column.children.length === 1 && selected?.object.value === 13) {
      column.appendChild(selected);
      selected.classList.remove("waste-card");
      selected.classList.remove("foundation-card");
      selected.classList.add("tableu-card");
    } else if (
      selected &&
      e.target.closest(".tableu-card")?.object &&
      e.target.closest(".tableu-card")?.children.length === 0 &&
      e.target.closest(".tableu-card").object.value ===
        selected.object.value + 1 &&
      e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
      e.target.closest(".tableu-card").appendChild(selected);
      selected.classList.remove("waste-card");
      selected.classList.remove("foundation-card");
      selected.classList.add("tableu-card");
    }

    while (selected && selectedStack.length) {
      selected.appendChild(selectedStack.shift());
      selected = selected.lastElementChild;
    }

    selected = null;
    selectedStack = [];
    revealedCardDirection();
    checkForMoves();
    autoComplete();
})};

//TABLEU CARD DIRECTIONS
//========================================================

function gameStartCardDirection() {
  for (const column of columns) {
    const cardsInColumn = column.querySelectorAll(".tableu-card");

    for (const card of cardsInColumn) {
      if (card !== column.lastElementChild) {
        card.classList.add("back");
        card.innerHTML = "";
      }
    }
  }
}

gameStartCardDirection();

function revealedCardDirection() {
  for (const column of columns) {
    const cardsInColumn = column.querySelectorAll(".tableu-card");

    for (const card of cardsInColumn) {
      if (card === column.lastElementChild) {
        if (card.classList.contains("back")) {
          card.classList.remove("back");
          card.textContent = `
                        ${getCardValue(card.object.value)}
                        ${getSuitSymbol(card.object.suit)}
                    `;
        }
      }
    }
  }
}


//STOCK PILE CARD DIRECTION
//========================================================
const stockPile = document.querySelector("#stock");
const wastePile = document.querySelector("#waste");

function stockPileCardDirection() {
  const cardsInStock = stockPile.querySelectorAll(".stock-card");

  for (const card of cardsInStock) {
    card.classList.add("back");
    card.innerHTML = "";
  }
}

stockPileCardDirection();

function wastePileCardDirection() {
  const cardsInWaste = wastePile.querySelectorAll(".waste-card");

  for (const card of cardsInWaste) {
    card.classList.remove("back");
    card.textContent = `
                    ${getCardValue(card.object.value)}
                    ${getSuitSymbol(card.object.suit)}
            `;
  }
}

wastePileCardDirection();

//CLICK TO MOVE STOCK CARD TO MESS PILE & RETURN MESS PILE CARDS TO STOCK PILE
//========================================================

stockPile.addEventListener("click", function (e) {
  if (e.target === stockPile.lastElementChild) {
    wastePile.appendChild(e.target);
    e.target.classList.remove("stock-card");
    e.target.classList.add("waste-card");
    e.target.setAttribute("draggable", true);
    wastePileCardDirection();
    checkForMoves();
  } else if (
    e.target === stockPile &&
    stockPile.children.length === 0 &&
    wastePile.children.length > 0
  ) {
    while (
      wastePile.lastElementChild // Returns cards one by one to ensure the order remains the same as at game start
    ) {
      const returningCard = wastePile.lastElementChild;
      returningCard.classList.remove("waste-card");
      returningCard.classList.add("stock-card");
      returningCard.setAttribute("draggable", false);
      stockPile.appendChild(returningCard);
    }

    stockPileCardDirection();
    console.log("Stock pile recycled.");
    checkForMoves();
  }
});

//CHANGE CURSOR WHEN BOTH STOCK AND WASTE PILES ARE EMPTY
//========================================================

stockPile.addEventListener("mouseover", function (e) {
  if (stockPile.children.length === 0 && wastePile.children.length === 0)
    stockPile.style.cursor = "not-allowed";
  wastePile.style.cursor = "not-allowed";
});

//ALLOW DRAGGING OF WASTE PILE CARDS
//========================================================

wastePile.addEventListener("dragstart", function (e) {
  if (e.target === wastePile.lastElementChild) {
    selected = e.target;
  } else {
    selected = null;
    e.preventDefault();
  }
});

//CHECK FOR MOVES
//========================================================

function checkForMoves() {
  const tableuCards = document.querySelectorAll(".tableu-card");
  const foundationCards = document.querySelectorAll(".foundation-card");
  const wasteCards = document.querySelectorAll(".waste-card");
  const stockCards = document.querySelectorAll(".stock-card");

  // 1. Checks for moves within tableu

  function tableuToTableuMove() {
    let tableuToTableuMoveFound = false;

    for (const movableCard of tableuCards) {
      if (movableCard.classList.contains("back")) continue;

      for (const movePair of tableuCards) {
        if (
          movePair !== movableCard &&
          movePair.children.length === 0 &&
          movePair.object.value === movableCard.object.value + 1 &&
          movePair.object.color !== movableCard.object.color &&
          blockTableuMoveLoop(movableCard, movePair) &&
          !movePair.classList.contains("back")
        ) {
          tableuToTableuMoveFound = true;
          console.log("Tableu to tableu move found:", movableCard, movePair);
        }
      }
    }

    // Below function blocks an available move from being read if the card to be moved is already on top of a card of the same color and value as the potential parent card match, and the existing parent can't be moved to foundation

    function blockTableuMoveLoop(movableCard, movePair) {
      let allowTableuMove = true;

      const parentCard = movableCard.parentElement?.closest(".tableu-card");

      if (!parentCard?.object) return allowTableuMove;

      if (
        movePair.object.value !== parentCard.object.value ||
        movePair.object.color !== parentCard.object.color
      ) {
        return allowTableuMove;
      }

      for (const pile of foundationPile) {
        if (
          parentCard.object.value ===
            pile.lastElementChild?.object?.value + 1 &&
          parentCard.object.suit === pile.dataset.suit
        ) {
          return allowTableuMove;
        }
      }
      allowTableuMove = false;
      return allowTableuMove;
    }

    return tableuToTableuMoveFound;
  }

  // 2. Checks for moves from tableu to foundation

  function tableuToFoundationMove() {
    let tableuToFoundationMoveFound = false;

    for (const movableCard of tableuCards) {
      if (
        movableCard.classList.contains("back") ||
        movableCard.children.length > 0
      )
        continue;

      for (const movePair of foundationCards) {
        for (const pile of foundationPile) {
          if (
            movePair.object.value === movableCard.object.value - 1 &&
            movePair.object.suit === movableCard.object.suit
          ) {
            tableuToFoundationMoveFound = true;
            console.log(
              "Tableu to foundation move found:",
              movableCard,
              movePair,
            );
          }
        }
      }
    }

    return tableuToFoundationMoveFound;
  }

  // 3. Checks for moves from waste pile to tableu

  function wasteToTableuMove() {
    let wasteToTableuMoveFound = false;

    for (const movableCard of wasteCards) {
      for (const movePair of tableuCards) {
        if (
          movePair.children.length === 0 &&
          movePair.object.value === movableCard.object.value + 1 &&
          movePair.object.color !== movableCard.object.color &&
          !movePair.classList.contains("back")
        ) {
          wasteToTableuMoveFound = true;
          console.log(
            "Waste pile to tableu move found:",
            movableCard,
            movePair,
          );
        }
      }
    }

    return wasteToTableuMoveFound;
  }

  // 4. Checks for moves from waste pile to foundation

  function wasteToFoundationMove() {
    let wasteToFoundationMoveFound = false;

    for (const movableCard of wasteCards) {
      for (const movePair of foundationCards) {
        for (const pile of foundationPile) {
          if (
            movePair.object.value === movableCard.object.value - 1 &&
            movePair.object.suit === movableCard.object.suit
          ) {
            wasteToFoundationMoveFound = true;
            console.log(
              "Waste pile to foundation move found:",
              movableCard,
              movePair,
            );
          }
        }
      }
    }

    return wasteToFoundationMoveFound;
  }

  // 5. Checks for moves from stock pile to tableu
  function stockToTableuMove() {
    let stockToTableuMoveFound = false;

    for (const movableCard of stockCards) {
      for (const movePair of tableuCards) {
        if (
          movePair.children.length === 0 &&
          movePair.object.value === movableCard.object.value + 1 &&
          movePair.object.color !== movableCard.object.color &&
          !movePair.classList.contains("back")
        ) {
          stockToTableuMoveFound = true;
          console.log(
            "Stock pile to tableu move found:",
            movableCard,
            movePair,
          );
        }
      }
    }
    return stockToTableuMoveFound;
  }

  // 6. Checks for moves from stock pile to foundation

  function stockToFoundationMove() {
    let stockToFoundationMoveFound = false;

    for (const movableCard of stockCards) {
      for (const pile of foundationPile) {
        for (const movePair of foundationCards) {
          if (
            movePair.object.value === movableCard.object.value - 1 &&
            movePair.object.suit === movableCard.object.suit &&
            movePair === pile.lastElementChild
          ) {
            stockToFoundationMoveFound = true;
            console.log(
              "Waste pile to foundation move found:",
              movableCard,
              movePair,
            );
          }
        }
      }
    }

    return stockToFoundationMoveFound;
  }

  // 7. Checks for kings that can be moved to an empty column and prevents a loop of moving a king already in an empty column to other empty columns

  function kingToEmptyColumnMove() {
    let kingToEmptyColumnMoveFound = false;

    for (const column of columns) {
      if (column.children.length !== 1) continue;

      for (const movableCard of tableuCards) {
        if (
          movableCard.object.value === 13 &&
          !movableCard.classList.contains("back") &&
          !movableCard.previousElementSibling?.classList.contains(
            "empty-column",
          ) // Blocks a move if a king is already in an empty column
        ) {
          kingToEmptyColumnMoveFound = true;
          console.log(
            "Tableu king to empty column move found:",
            movableCard,
            column,
          );
        }
      }

      for (const movableCard of wasteCards) {
        if (movableCard.object.value === 13) {
          kingToEmptyColumnMoveFound = true;
          console.log(
            "Waste pile king to empty column move found:",
            movableCard,
            column,
          );
        }
      }

      for (const movableCard of stockCards) {
        if (movableCard.object.value === 13) {
          kingToEmptyColumnMoveFound = true;
          console.log(
            "Stock pile king to empty column move found:",
            movableCard,
            column,
          );
        }
      }
    }

    return kingToEmptyColumnMoveFound;
  }

  // 8. Checks moves for aces to be moved to an empty foundation pile of the same suit

  function aceToEmptyFoundationMove() {
    let aceToEmptyFoundationMoveFound = false;

    for (const pile of foundationPile) {
      if (pile.children.length !== 0) continue;

      for (const movableCard of tableuCards) {
        if (
          movableCard.object.value === 1 &&
          !movableCard.classList.contains("back") &&
          movableCard.object.suit === pile.dataset.suit &&
          movableCard !== pile.lastElementChild // Blocks a move if an ace is already in an empty foundation
        ) {
          aceToEmptyFoundationMoveFound = true;
          console.log(
            "Tableu ace to empty foundation pile move found:",
            movableCard,
            pile,
          );
        }
      }

      for (const movableCard of wasteCards) {
        if (
          movableCard.object.value === 1 &&
          movableCard.object.suit === pile.dataset.suit
        ) {
          aceToEmptyFoundationMoveFound = true;
          console.log(
            "Waste pile ace to empty foundation pile found:",
            movableCard,
            pile,
          );
        }
      }

      for (const movableCard of stockCards) {
        if (
          movableCard.object.value === 1 &&
          movableCard.object.suit === pile.dataset.suit
        ) {
          aceToEmptyFoundationMoveFound = true;
          console.log(
            "Stock pile ace to empty foundation pile found:",
            movableCard,
            pile,
          );
        }
      }
    }

    return aceToEmptyFoundationMoveFound;
  }

  // Checks if there is available moves in any section and reports true if there is even one move available. Reports false only if there is no moves anywhere.

  let movesAvailable = false;

  if (tableuToTableuMove()) movesAvailable = true;
  if (tableuToFoundationMove()) movesAvailable = true;
  if (wasteToTableuMove()) movesAvailable = true;
  if (wasteToFoundationMove()) movesAvailable = true;
  if (stockToTableuMove()) movesAvailable = true;
  if (stockToFoundationMove()) movesAvailable = true;
  if (kingToEmptyColumnMove()) movesAvailable = true;
  if (aceToEmptyFoundationMove()) movesAvailable = true;

  console.log("Moves available:", movesAvailable);

  function noMoreMovesAlert() {
    const noMoreMovesModal = document.getElementById("no-moves-modal");
    const playAgainBtn = document.getElementById("play-again-gameover");
    
    if (noMoreMovesModal) {
      noMoreMovesModal.classList.remove("hidden");
     }
    
     if (playAgainBtn) {
    playAgainBtn.addEventListener("click", function () {
    window.location.reload();
    });
    }
    }

    const gameWon =
    document.querySelectorAll(".foundation-card").length === 52;

    if (movesAvailable === false && !gameWon) {
    stopTimer();
    noMoreMovesAlert();
    }

    return movesAvailable;
}

checkForMoves();

// AUTO-COMPLETE
//========================================================

function autoComplete(){
    
    const tableuCards = document.querySelectorAll(".tableu-card");
    const buttons = document.querySelector("#buttons");

    for (const card of tableuCards) {
        if (card.classList.contains('back')) {
            return;
        }
    }
    //added this to stop creating button if it already exists
    if (document.querySelector("#Auto-complete")){
      return;

    }

    let autoCompleteButton = document.createElement("button");
    autoCompleteButton.setAttribute("id","auto-complete");
    buttons.appendChild(autoCompleteButton);
    autoCompleteButton.textContent = "Auto-complete";
    
    autoCompleteButton.addEventListener("click", function() {
        stopTimer;
        if (victoryModal) {
            victoryModal.classList.remove("hidden"); // Show victory popup
        }
    });

}

// INSTRUCTIONS
//========================================================


// Get elements by ID
const modal = document.getElementById("instructions-modal");
const openBtn = document.getElementById("hint");
const closeBtn = document.getElementById("close-instructions");

// Click Instructions button to show popup
openBtn.onclick = function () {
  modal.classList.remove("hidden");
};

// Click Close button to hide popup
closeBtn.onclick = function () {
  modal.classList.add("hidden");
};

//TIMER
//========================================================

// 1. Create variables to hold the raw time and the interval reference
let totalSeconds = 0;
let timerInterval = null;

// Turn seconds into a clock time, like 02:05.
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let leftoverSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(leftoverSeconds).padStart(2, "0")}`;
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

  timerInterval = setInterval(function () {
    totalSeconds++; // Add 1 to total seconds
    updateTimerDisplay(); // Refresh the screen display
  }, 1000); // 1000 milliseconds = repeat every 1 second
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

// Show the fastest saved time when the game opens.
let bestTime = localStorage.getItem("solitaireBestTime");
if (bestTime !== null) {
  document.getElementById("best-time").innerText = formatTime(Number(bestTime));
}

// Save this game's time, then start the next game from zero.
document.getElementById("restart").addEventListener("click", function () {
    window.location.reload();

  // resetTimer();
  // startTimer();
});

// Automatically start the timer when the script loads
updateTimerDisplay();
startTimer();

//-------------------------------------------------//
// victory conditions
//-------------------------------------------------//
// Get Victory Modal and Play Again button elements
const victoryModal = document.getElementById("victory-modal");
const playAgainBtn = document.getElementById("play-again-victory");

// Checks if all 52 cards have been placed in the foundation piles (13 in each of the 4 piles)
function checkVictoryCondition() {
  const foundationCards = document.querySelectorAll(".foundation-card");

  // Total cards in solitaire is 52
  if (foundationCards.length === 52) {
    stopTimer(); // Pause the timer on victory

    if (victoryModal) {
      victoryModal.classList.remove("hidden"); // Show victory popup
    }
  }
}

// Reload the game when "Play Again" button is clicked inside the victory popup
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", function () {
    localStorage.setItem("solitaireScore", totalSeconds);
    document.getElementById("score").innerText = formatTime(totalSeconds);
    if (bestTime === null || totalSeconds < Number(bestTime)) {
    localStorage.setItem("solitaireBestTime", totalSeconds);}
    window.location.reload();

  });
}

//-------------------------------------------------//