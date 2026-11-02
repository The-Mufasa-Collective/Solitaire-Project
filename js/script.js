

function loadTimeFromStorage() {
    let totalSeconds = localStorage.getItem("solitaireScore");
    if(totalSeconds == null) return;
    document.getElementById("score").innerText = formatTime(totalSeconds);
}

loadTimeFromStorage()

// create a fresh deck of cards and shuffles it
// color is implied by the suit
function createStartingDeck() {
    let deck = [];

    for(i = 1; i <= 13; i++) {
        deck.push({
            value: i,
            hidden: true,
            color: "black",
            suit: "spades"
        });
        deck.push({
            value: i,
            hidden: true,
            color: "red",
            suit: "hearts"
        });
        deck.push({
            value: i,
            hidden: true,
            color: "red",
            suit: "diamonds"
        });
        deck.push({
            value: i,
            hidden: true,
            color: "black",
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

function getSuitSymbol(suit){
        if(suit == "hearts") return "♥";
        else if(suit == "spades") return "♠";
        else if(suit == "diamonds") return "♦";
        else if(suit == "clubs") return "♣";
}

function getCardValue(value) {
    if(value === 1) return "A";
    else if(value === 11) return "J";
    else if(value === 12) return "Q";
    else if(value === 13) return "K";
    else return value;
}

function renderCard(card) {
    let cardElement = document.createElement("div")
    cardElement.setAttribute("id", `card-${card.suit}-${card.value}`)

    cardElement.setAttribute("class", `card ${card.color}`)
    cardElement.setAttribute("draggable", true)
    cardElement.innerHTML = `
            <div> ${getCardValue(card.value)} </div>
            <div> ${getSuitSymbol(card.suit)} </div>
        `;

    return cardElement;
}


function renderStock(gameDeck) {
    let stock = document.getElementById("stock");

    gameDeck.forEach(card => {
        let cardElement = document.createElement("div")
        cardElement.setAttribute("id", `card-${card.suit}-${card.value}`)
        cardElement.setAttribute("class", `card ${card.color} stock-card`)
        cardElement.setAttribute("draggable", false)

        cardElement.object = card

        stock.appendChild(cardElement)
    });
}

function prepareGameCards( )  {
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
            column.appendChild(renderedCard)
        }
    }
    // render the remaining card in the stock.
    renderStock(gameDeck);
}

prepareGameCards();

//FOUNDATION BEHAVIOR
//========================================================

const foundationPile= document.querySelectorAll(".foundation"); //holds the 4 foundation boxes

//checks if a card is an ace. takes one card and gives back true or false
function isAce(card) {
    if (card.object.value === 1){ //card.object.value is the number inside the card. ace has the no. 1
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
// const heartsBox = document.querySelector('[data-suit="hearts"]');
// // console.log(sameSuit(heartsAceElement, heartsBox));
// // console.log(sameSuit(clubsAceElement, heartsBox)); 


function goesOnFoundation(card, foundation){ //card on top of the box or null if the box is empty
    const topCard = foundation.lastElementChild;

    if (sameSuit (card, foundation)) {

        if (topCard === null) { //empty box, only ace is allowed
            if (isAce(card)){
                return true;
            } else {
                return false;
            }

        } else {
            if (card.object.value === topCard.object.value + 1){ // the card must be 1 higher than top card
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
//  const allCards = document.querySelectorAll(".tableu-card");
// for (const card of allCards) {
//     card.addEventListener("dragstart", function() {
//         selected = card;
//     });
// }

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

column.addEventListener("dragover", function(e) {
    if (column.children.length === 1 && selected?.object.value === 13) {
        e.preventDefault();
    } else if (
        e.target.closest(".tableu-card")?.object &&
        selected?.object &&
        e.target.closest(".tableu-card").object.value === selected.object.value + 1 &&
        e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
        e.preventDefault();
    }
});

column.addEventListener("drop", function(e) {
    if (column.children.length === 1 && selected?.object.value === 13) {
        column.appendChild(selected);
        selected.classList.remove('waste-card');
        selected.classList.remove('foundation-card');
        selected.classList.add('tableu-card');
    } else if (
        selected &&
        e.target.closest(".tableu-card")?.object &&
        e.target.closest(".tableu-card").object.value === selected.object.value + 1 &&
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

//TABLEU CARD DIRECTIONS
//========================================================

function gameStartCardDirection() {
    for (const column of columns) {
        const cardsInColumn = column.querySelectorAll('.tableu-card');

        for (const card of cardsInColumn) {
            if (card !== column.lastElementChild) {
                card.classList.add('back');
                card.innerHTML = "";
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
                if (card.classList.contains("back")) {
                    card.classList.remove('back');
                    card.innerHTML = `
                        <div> ${getCardValue(card.object.value)} </div>
                        <div> ${getSuitSymbol(card.object.suit)} </div>
                    `;
                }
            }
        }
    }
};

//STOCK PILE CARD DIRECTION
//========================================================
const stockPile = document.querySelector('#stock')
const wastePile = document.querySelector('#waste')

function stockPileCardDirection() {
    const cardsInStock = stockPile.querySelectorAll('.stock-card');

    for (const card of cardsInStock) {
            card.classList.add('back');
            card.innerHTML = "";
    }
}

        stockPileCardDirection();

function wastePileCardDirection() {
    const cardsInWaste = wastePile.querySelectorAll('.waste-card');

    for (const card of cardsInWaste) {
            card.classList.remove('back');
            card.innerHTML = `
                    <div> ${getCardValue(card.object.value)} </div>
                    <div> ${getSuitSymbol(card.object.suit)} </div>
            `;
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
        while (wastePile.lastElementChild) {
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

    //proposal: easiet way to start a new game is by reloading the page. The game is time is picked up from storage
    window.location.reload();

    resetTimer();
    startTimer();
});

// Automatically start the timer when the script loads
updateTimerDisplay();
startTimer();
