/*
*   Main method
*   responsible for setup and cleanup of the game for restarts
*/
function main() {
    let gameDeck = [];

    gameDeck = createStartingDeck();

    gameLoop(gameDeck);
}

/*
*   game loop method
*   responsible for playing the game, 
*   i.e: react to player input and serve card, track score, ect
*/
function gameLoop(gameDeck) {
    console.log(gameDeck);

    renderStock(gameDeck)
    gameDeck[0].hidden = false;
    serveCardToColumn(gameDeck[0], "column1");
}

function renderStock(gameDeck) {
    let stock = document.getElementById("stock");

    gameDeck.forEach(card => {
        stock.appendChild(renderCard(card))
    });
}

function serveCardToColumn(servedCard, targetPile) {
    let pile = document.getElementById(targetPile);
    pile.appendChild(renderCard(servedCard))
}

// create a fresh deck of cards and shuffles it
function createStartingDeck() {
    let deck = [];

    for(i = 1; i <= 13; i++) {
        deck.push({
            value: i,
            hidden: true,
            suit: "spades"
        });
        deck.push({
            value: i,
            hidden: true,
            suit: "hearts"
        });
        deck.push({
            value: i,
            hidden: true,
            suit: "diamonds"
        });
        deck.push({
            value: i,
            hidden: true,
            suit: "clubs"
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
        deck[randomIndex], deck[currentIndex]];
    }

    return deck;
}

function renderCard(card) {
    let cardElement = document.createElement("div")
    cardElement.setAttribute("id", `card-${card.suit}-${card.value}`)

    if (card.hidden) {
        cardElement.setAttribute("class", "card back")
    } else {

        // compute display value
        let cardDisplayValue;

        if(card.value === 1) cardDisplayValue = "A";
        else if(card.value === 11) cardDisplayValue = "J";
        else if(card.value === 12) cardDisplayValue = "Q";
        else if(card.value === 13) cardDisplayValue = "K";
        else cardDisplayValue = card.value;

        //compute suite
        let suitDisplay;

        if(card.suit == "hearts") suitDisplay = "♥";
        else if(card.suit == "spades") suitDisplay = "♠";
        else if(card.suit == "diamonds") suitDisplay = "♦";
        else if(card.suit == "clubs") suitDisplay = "♣";


        cardElement.setAttribute("class", "card")
        cardElement.innerHTML = `
                <div> ${cardDisplayValue} </div>
                <div> ${suitDisplay} </div>
                <div> ${cardDisplayValue} </div>
            `;

    }
    return cardElement;
}

//run the game
main();


//DRAG AND DROP WITHIN TABLEU
//========================================================

const columns = document.querySelectorAll('.column'); 
let selected = null; 
let selectedStack = [];

for (const column of columns) { 

    column.addEventListener("dragstart", function(e) { 
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

        let sibling = selected.nextElementSibling;

        while (sibling) {
            selectedStack.push(sibling);
            sibling = sibling.nextElementSibling;
        }
    } else {
        selected = null;
        selectedStack = [];
        e.preventDefault();
    }
});

/*
column.addEventListener("dragover", function(e) {
    if (column.children.length === 1 && selected?.object === diamondKings) {
        e.preventDefault();
    } else if (
        e.target.closest(".tableu-card")?.object &&
        selected?.object &&
        e.target.closest(".tableu-card").object.number === selected.object.number + 1 &&
        e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
        e.preventDefault();
    }
});

column.addEventListener("drop", function(e) {
    if (selected?.object === diamondKings && column.children.length === 1) {
        column.appendChild(selected);
        selected.classList.remove('waste-card');
        selected.classList.add('tableu-card');
    } else if (
        selected &&
        e.target.closest(".tableu-card")?.object &&
        e.target.closest(".tableu-card").object.number === selected.object.number + 1 &&
        e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
        e.target.closest(".tableu-card").appendChild(selected);
        selected.classList.remove('waste-card');
        selected.classList.add('tableu-card');
    }

    while (selected && selectedStack.length) {
        selected.appendChild(selectedStack.shift());
        selected = selected.lastElementChild;
    }

    selected = null;
    selectedStack = [];
    revealedCardDirection();
})}; */

column.addEventListener("dragover", function(e) {
    if (column.children.length === 1) {
        e.preventDefault();
    } else if (
        e.target.closest(".tableu-card")?.object &&
        selected?.object &&
        e.target.closest(".tableu-card").object.number === selected.object.number + 1 &&
        e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
        e.preventDefault();
    }
});

column.addEventListener("drop", function(e) {
    if (column.children.length === 1) {
        column.appendChild(selected);
        selected.classList.remove('waste-card');
        selected.classList.remove('foundation-card');
        selected.classList.add('tableu-card');
    } else if (
        selected &&
        e.target.closest(".tableu-card")?.object &&
        e.target.closest(".tableu-card").object.number === selected.object.number + 1 &&
        e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
        e.target.closest(".tableu-card").appendChild(selected);
        selected.classList.remove('waste-card');
        selected.classList.remove('foundation-card');
        selected.classList.add('tableu-card');
    }

    while (selected && selectedStack.length) {
        selected.appendChild(selectedStack.shift());
        selected = selected.lastElementChild;
    }

    selected = null;
    selectedStack = [];
    revealedCardDirection();
})};

// TABLEU & FOUNDATION DRAG AND DROP EXHANGE PLACEHOLDER
//========================================================
/*
for (const foundation of foundationPile) {

foundation.addEventListener("dragstart", function(e) {
    if (
        e.target.closest(".tableu-card") === foundation.lastElementChild
    ) {
        selected = e.target.closest(".tableu-card");
        selectedStack = [];
    } else {
        selected = null;
        selectedStack = [];
        e.preventDefault();
    }
});

    foundation.addEventListener("dragover", function(e) {
        if (selected) {
            e.preventDefault();
        }
    });

    foundation.addEventListener("drop", function(e) {
        if (selected && selectedStack.length === 0) {
            e.preventDefault();
            foundation.appendChild(selected);
            selected = null;
            revealedCardDirection();
        }
    })};
*/
//TABLEU CARD DIRECTIONS
//========================================================

function gameStartCardDirection() {
    for (const column of columns) {
        const cardsInColumn = column.querySelectorAll('.tableu-card');

        for (const card of cardsInColumn) {
            if (card !== column.lastElementChild) {
                card.classList.add('back');
            }
        }
    }
};

gameStartCardDirection();

function revealedCardDirection() { 
    for (const column of columns) {
        const cardsInColumn = column.querySelectorAll('.tableu-card');

        for (const card of cardsInColumn) {
            if (card === column.lastElementChild) {
                card.classList.remove('back');
            }
        }
    }
};

//TABLEU PLACEHOLDER CARDS
//========================================================

const diamondKings = {
    color: "red",
    suit: "diamonds",
    number: 12,
};

for (const diamondKing of document.querySelectorAll('#diamond-king')){
    diamondKing.object = diamondKings;
}

const spadeQueens = {
    color: "black",
    suit: "spades",
    number: 12,
};

for (const spadesQueen of document.querySelectorAll('#spades-queen')){
    spadesQueen.object = spadeQueens;
}

const heartsJacks = {
    color: "red",
    suit: "hearts",
    number: 11,
};

for (const heartsJack of document.querySelectorAll('#hearts-jack')){
    heartsJack.object = heartsJacks;
}

const clubsTens = {
    color: "black",
    suit: "clubs",
    number: 10,
};

for (const clubsTen of document.querySelectorAll('#clubs-ten')){
    clubsTen.object = clubsTens;
}


const stockPile = document.querySelector('#stock')
const wastePile = document.querySelector('#waste')


//STOCK PILE CARD DIRECTION
//========================================================

function stockPileCardDirection() {
    const cardsInStock = stockPile.querySelectorAll('.stock-card');

    for (const card of cardsInStock) {
            card.classList.add('back');
        }
        }

        stockPileCardDirection();

function wastePileCardDirection() {
    const cardsInWaste = wastePile.querySelectorAll('.waste-card');

    for (const card of cardsInWaste) {
            card.classList.remove('back');
        }
        }

        wastePileCardDirection();

//CLICK TO MOVE STOCK CARD TO MESS PILE & RETURN MESS PILE CARDS TO STOCK PILE
//========================================================

stockPile.addEventListener("click", function(e) {
    if (e.target === stockPile.lastElementChild
    ) {
        wastePile.appendChild(e.target);
        e.target.classList.remove('stock-card');
        e.target.classList.add('waste-card');
        e.target.setAttribute('draggable', true);
        wastePileCardDirection();
    } else if (e.target === stockPile &&
        stockPile.children.length === 0 &&
        wastePile.children.length > 0
    ) {
    while (wastePile.lastElementChild
    ) {
    const returningCard = wastePile.lastElementChild;
    returningCard.classList.remove('waste-card');
    returningCard.classList.add('stock-card');
    returningCard.setAttribute('draggable', false);
    stockPile.appendChild(returningCard);
  }

  stockPileCardDirection();
}
});

//CHANGE CURSOR WHEN BOTH STOCK AND WASTE PILES ARE EMPTY
//========================================================

stockPile.addEventListener("mouseover", function(e){
    if (stockPile.children.length === 0 &&
        wastePile.children.length === 0
    ) stockPile.style.cursor = "not-allowed";
    wastePile.style.cursor = "not-allowed";
})


//ALLOW DRAGGING OF WASTE PILE CARDS
//========================================================

wastePile.addEventListener("dragstart", function(e) {
    if (e.target === wastePile.lastElementChild) {
        selected = e.target;
    } else {
        selected = null;
        e.preventDefault();
    }
});


//FOUNDATION BEHAVIOR
//========================================================

const foundationPile= document.querySelectorAll(".foundation"); //holds the 4 foundation boxes

//test cards info
const heartsAce = { color: "red", suit: "hearts", number: 1 };

const heartsTwo= { color:"red", suit: "hearts", number: 2 };

const heartsThree= { color: "red", suit:"hearts", number: 3 };

const clubsAce = { color: "black", suit: "clubs", number: 1 };

//attaches each cards info to its element in the html page. also, so the code can read card.object.number later
const heartsAceElement = document.getElementById("hearts-ace");
heartsAceElement.object = heartsAce;

const heartsTwoElement= document.getElementById("hearts-two");
heartsTwoElement.object = heartsTwo;

const heartsThreeElement = document.getElementById("hearts-three");
heartsThreeElement.object = heartsThree;

const clubsAceElement = document.getElementById("clubs-ace");
clubsAceElement.object = clubsAce;

//checks if a card is an ace. takes one card and gives back true or false
function isAce(card) {
    if (card.object.number === 1){ //card.object.number is the number inside the card. ace has the no. 1
        return true;
    } else {
        return false;
    }
};

//checks if its the same suit as a foundation box. takes a card and a box and gives back true or false
function sameSuit(card, foundation) {
    if (card.object.suit === foundation.dataset.suit){ //card.object.suit is the suit inside the card.foundation.dataset.suit is the data-suit box in html
        return true;
    } else {
        return false;
    }
};
//for test only, finds the hearts box and tries the sameSuit function
const heartsBox = document.querySelector('[data-suit="hearts"]');
console.log(sameSuit(heartsAceElement, heartsBox));
console.log(sameSuit(clubsAceElement, heartsBox)); 


function goesOnFoundation(card, foundation){ //card on top of the box or null if the box is empty
    const topCard= foundation.lastElementChild;

    if (sameSuit (card, foundation)) {

        if (topCard === null) { //empty box, only ace is allowed
            if (isAce(card)){
                return true;
            } else {
                return false;
            }

        } else {
            if (card.object.number === topCard.object.number + 1){ // the card must be 1 higher than top card
                return true;
            } else {
                return false;
            }

        }
    } else { // not same suit
        return false;
    }
}


//for test only, anette has done this part so delete after testing
/* const allCards = document.querySelectorAll(".tableu-card");
for (const card of allCards) {
    card.addEventListener("dragstart", function() {
        selected = card;
    });
} */

// does for each of the 4 foundation boxes
for (const foundation of foundationPile) {

    //runs when a card is held over this box.
    //e.preventDefault() says yes, you can drop here
    foundation.addEventListener("dragover", function(e) {
        if (selected !== null) {                       // when card is in hand
            if (goesOnFoundation(selected, foundation)) { 
                e.preventDefault();
            }
        }
    });

    //happens when you drop card over this box
    foundation.addEventListener("drop", function(e) {
        if (selected !== null) {
            if (goesOnFoundation(selected, foundation)) {
                e.preventDefault();
                foundation.appendChild(selected);   //move the card into the box
                selected.classList.add('foundation-card');
                selected.classList.remove('tableu-card');
                selected = null;                    //hand is emtpy now
                revealedCardDirection();
            }
        }
    });
}

// does this for each 4 foundation boxes
for (const foundation of foundationPile) {

    //runs when start dragging something inside this box
    foundation.addEventListener("dragstart", function(e) {  //e.target is the card you grabbed

       
        //lastElementChild is top card of this box
        if (e.target === foundation.lastElementChild) {
            selected = e.target;       //it is the top card, allowed
        } else {
            selected = null;           //it is a lower card, hold nothing
            e.preventDefault();        //cancel the drag
        }
    });
}

//TIMER
//========================================================

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
