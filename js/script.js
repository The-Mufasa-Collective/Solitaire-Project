/*
*   Main method
*   responsible for setup and cleanup of the game for restarts

function main() {
    let gameDeck = [];

    gameDeck = createStartingDeck();

    gameLoop(gameDeck);
}*/

/*
*   game loop method
*   responsible for playing the game, 
*   i.e: react to player input and serve card, track score, ect
*/
/*
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
main(); */

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


function goesOnFoundation(card, foundation){ //card on top of the box or null if the box is empty
    
    if (card.children.length > 0) return false;
    const topCard= foundation.lastElementChild;
    
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
                selected.classList.remove('waste-card');
                selected.classList.remove('stock-card');
                selected = null;                    //hand is emtpy now
                revealedCardDirection();
                checkForMoves();
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
        e.target.closest(".tableu-card")?.children.length === 0 &&
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
        e.target.closest(".tableu-card")?.children.length === 0 &&
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
    checkForMoves();
})};

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

// Diamond
const diamondKings = {
    color: "red",
    suit: "diamonds",
    value: 13,
};

for (const diamondKing of document.querySelectorAll('#diamond-king')){
    diamondKing.object = diamondKings;
}
const diamondQueens = {
    color: "red",
    suit: "diamonds",
    value: 12,
};

for (const diamondQueen of document.querySelectorAll('#diamond-queen')){
    diamondQueen.object = diamondQueens;
}

const diamondJacks = {
    color: "red",
    suit: "diamonds",
    value: 11,
};

for (const diamondJack of document.querySelectorAll('#diamond-jack')){
    diamondJack.object = diamondJacks;
}
const diamondTens = {
    color: "red",
    suit: "diamonds",
    value: 10,
};

for (const diamondTen of document.querySelectorAll('#diamond-ten')){
    diamondTen.object = diamondTens;
}

const diamondNines = {
    color: "red",
    suit: "diamonds",
    value: 9,
};

for (const diamondNine of document.querySelectorAll('#diamond-nine')){
    diamondNine.object = diamondNines;
}

const diamondEights = {
    color: "red",
    suit: "diamonds",
    value: 8,
};

for (const diamondEight of document.querySelectorAll('#diamond-eight')){
    diamondEight.object = diamondEights;
}

const diamondSevens = {
    color: "red",
    suit: "diamonds",
    value: 7,
};

for (const diamondSeven of document.querySelectorAll('#diamond-seven')){
    diamondSeven.object = diamondSevens;
}

const diamondSixes = {
    color: "red",
    suit: "diamonds",
    value: 6,
};

for (const diamondSix of document.querySelectorAll('#diamond-six')){
    diamondSix.object = diamondSixes;
}

const diamondFives = {
    color: "red",
    suit: "diamonds",
    value: 5,
};

for (const diamondFive of document.querySelectorAll('#diamond-five')){
    diamondFive.object = diamondFives;
}

const diamondFours = {
    color: "red",
    suit: "diamonds",
    value: 4,
};

for (const diamondFour of document.querySelectorAll('#diamond-four')){
    diamondFour.object = diamondFours;
}

const diamondThrees = {
    color: "red",
    suit: "diamonds",
    value: 3,
};

for (const diamondThree of document.querySelectorAll('#diamond-three')){
    diamondThree.object = diamondThrees;
}

const diamondTwos = {
    color: "red",
    suit: "diamonds",
    value: 2,
};

for (const diamondTwo of document.querySelectorAll('#diamond-two')){
    diamondTwo.object = diamondTwos;
}

const diamondAces = {
    color: "red",
    suit: "diamonds",
    value: 1,
};

for (const diamondAce of document.querySelectorAll('#diamond-ace')){
    diamondAce.object = diamondAces;
}

// Heart

const heartKings = {
    color: "red",
    suit: "hearts",
    value: 13,
};

for (const heartKing of document.querySelectorAll('#heart-king')){
    heartKing.object = heartKings;
}
const heartQueens = {
    color: "red",
    suit: "hearts",
    value: 12,
};

for (const heartQueen of document.querySelectorAll('#heart-queen')){
    heartQueen.object = heartQueens;
}

const heartJacks = {
    color: "red",
    suit: "hearts",
    value: 11,
};

for (const heartJack of document.querySelectorAll('#heart-jack')){
    heartJack.object = heartJacks;
}
const heartTens = {
    color: "red",
    suit: "hearts",
    value: 10,
};

for (const heartTen of document.querySelectorAll('#heart-ten')){
    heartTen.object = heartTens;
}

const heartNines = {
    color: "red",
    suit: "hearts",
    value: 9,
};

for (const heartNine of document.querySelectorAll('#heart-nine')){
    heartNine.object = heartNines;
}

const heartEights = {
    color: "red",
    suit: "hearts",
    value: 8,
};

for (const heartEight of document.querySelectorAll('#heart-eight')){
    heartEight.object = heartEights;
}

const heartSevens = {
    color: "red",
    suit: "hearts",
    value: 7,
};

for (const heartSeven of document.querySelectorAll('#heart-seven')){
    heartSeven.object = heartSevens;
}

const heartSixes = {
    color: "red",
    suit: "hearts",
    value: 6,
};

for (const heartSix of document.querySelectorAll('#heart-six')){
    heartSix.object = heartSixes;
}

const heartFives = {
    color: "red",
    suit: "hearts",
    value: 5,
};

for (const heartFive of document.querySelectorAll('#heart-five')){
    heartFive.object = heartFives;
}

const heartFours = {
    color: "red",
    suit: "hearts",
    value: 4,
};

for (const heartFour of document.querySelectorAll('#heart-four')){
    heartFour.object = heartFours;
}

const heartThrees = {
    color: "red",
    suit: "hearts",
    value: 3,
};

for (const heartThree of document.querySelectorAll('#heart-three')){
    heartThree.object = heartThrees;
}

const heartTwos = {
    color: "red",
    suit: "hearts",
    value: 2,
};

for (const heartTwo of document.querySelectorAll('#heart-two')){
    heartTwo.object = heartTwos;
}

const heartAces = {
    color: "red",
    suit: "hearts",
    value: 1,
};

for (const heartAce of document.querySelectorAll('#heart-ace')){
    heartAce.object = heartAces;
}

// Spades

const spadeKings = {
    color: "black",
    suit: "spades",
    value: 13,
};

for (const spadeKing of document.querySelectorAll('#spade-king')){
    spadeKing.object = spadeKings;
}
const spadeQueens = {
    color: "black",
    suit: "spades",
    value: 12,
};

for (const spadeQueen of document.querySelectorAll('#spade-queen')){
    spadeQueen.object = spadeQueens;
}

const spadeJacks = {
    color: "black",
    suit: "spades",
    value: 11,
};

for (const spadeJack of document.querySelectorAll('#spade-jack')){
    spadeJack.object = spadeJacks;
}
const spadeTens = {
    color: "black",
    suit: "spades",
    value: 10,
};

for (const spadeTen of document.querySelectorAll('#spade-ten')){
    spadeTen.object = spadeTens;
}

const spadeNines = {
    color: "black",
    suit: "spades",
    value: 9,
};

for (const spadeNine of document.querySelectorAll('#spade-nine')){
    spadeNine.object = spadeNines;
}

const spadeEights = {
    color: "black",
    suit: "spades",
    value: 8,
};

for (const spadeEight of document.querySelectorAll('#spade-eight')){
    spadeEight.object = spadeEights;
}

const spadeSevens = {
    color: "black",
    suit: "spades",
    value: 7,
};

for (const spadeSeven of document.querySelectorAll('#spade-seven')){
    spadeSeven.object = spadeSevens;
}

const spadeSixes = {
    color: "black",
    suit: "spades",
    value: 6,
};

for (const spadeSix of document.querySelectorAll('#spade-six')){
    spadeSix.object = spadeSixes;
}

const spadeFives = {
    color: "black",
    suit: "spades",
    value: 5,
};

for (const spadeFive of document.querySelectorAll('#spade-five')){
    spadeFive.object = spadeFives;
}

const spadeFours = {
    color: "black",
    suit: "spades",
    value: 4,
};

for (const spadeFour of document.querySelectorAll('#spade-four')){
    spadeFour.object = spadeFours;
}

const spadeThrees = {
    color: "black",
    suit: "spades",
    value: 3,
};

for (const spadeThree of document.querySelectorAll('#spade-three')){
    spadeThree.object = spadeThrees;
}

const spadeTwos = {
    color: "black",
    suit: "spades",
    value: 2,
};

for (const spadeTwo of document.querySelectorAll('#spade-two')){
    spadeTwo.object = spadeTwos;
}

const spadeAces = {
    color: "black",
    suit: "spades",
    value: 1,
};

for (const spadeAce of document.querySelectorAll('#spade-ace')){
    spadeAce.object = spadeAces;
}

// Clubs

const clubKings = {
    color: "black",
    suit: "clubs",
    value: 13,
};

for (const clubKing of document.querySelectorAll('#club-king')){
    clubKing.object = clubKings;
}
const clubQueens = {
    color: "black",
    suit: "clubs",
    value: 12,
};

for (const clubQueen of document.querySelectorAll('#club-queen')){
    clubQueen.object = clubQueens;
}

const clubJacks = {
    color: "black",
    suit: "clubs",
    value: 11,
};

for (const clubJack of document.querySelectorAll('#club-jack')){
    clubJack.object = clubJacks;
}
const clubTens = {
    color: "black",
    suit: "clubs",
    value: 10,
};

for (const clubTen of document.querySelectorAll('#club-ten')){
    clubTen.object = clubTens;
}

const clubNines = {
    color: "black",
    suit: "clubs",
    value: 9,
};

for (const clubNine of document.querySelectorAll('#club-nine')){
    clubNine.object = clubNines;
}

const clubEights = {
    color: "black",
    suit: "clubs",
    value: 8,
};

for (const clubEight of document.querySelectorAll('#club-eight')){
    clubEight.object = clubEights;
}

const clubSevens = {
    color: "black",
    suit: "clubs",
    value: 7,
};

for (const clubSeven of document.querySelectorAll('#club-seven')){
    clubSeven.object = clubSevens;
}

const clubSixes = {
    color: "black",
    suit: "clubs",
    value: 6,
};

for (const clubSix of document.querySelectorAll('#club-six')){
    clubSix.object = clubSixes;
}

const clubFives = {
    color: "black",
    suit: "clubs",
    value: 5,
};

for (const clubFive of document.querySelectorAll('#club-five')){
    clubFive.object = clubFives;
}

const clubFours = {
    color: "black",
    suit: "clubs",
    value: 4,
};

for (const clubFour of document.querySelectorAll('#club-four')){
    clubFour.object = clubFours;
}

const clubThrees = {
    color: "black",
    suit: "clubs",
    value: 3,
};

for (const clubThree of document.querySelectorAll('#club-three')){
    clubThree.object = clubThrees;
}

const clubTwos = {
    color: "black",
    suit: "clubs",
    value: 2,
};

for (const clubTwo of document.querySelectorAll('#club-two')){
    clubTwo.object = clubTwos;
}

const clubAces = {
    color: "black",
    suit: "clubs",
    value: 1,
};

for (const clubAce of document.querySelectorAll('#club-ace')){
    clubAce.object = clubAces;
}

//STOCK PILE CARD DIRECTION
//========================================================
const stockPile = document.querySelector('#stock')
const wastePile = document.querySelector('#waste')

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
        checkForMoves();
    } else if (e.target === stockPile &&
        stockPile.children.length === 0 &&
        wastePile.children.length > 0
    ) {
    while (wastePile.lastElementChild // Returns cards one by one to ensure the order remains the same as at game start
    ) {
    const returningCard = wastePile.lastElementChild;
    returningCard.classList.remove('waste-card');
    returningCard.classList.add('stock-card');
    returningCard.setAttribute('draggable', false);
    stockPile.appendChild(returningCard);
  }

  stockPileCardDirection();
  console.log("Stock pile recycled.");
  checkForMoves();
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


//CHECK FOR MOVES
//========================================================

function checkForMoves() {

const tableuCards = document.querySelectorAll('.tableu-card');
const foundationCards = document.querySelectorAll('.foundation-card');
const wasteCards = document.querySelectorAll('.waste-card');
const stockCards = document.querySelectorAll('.stock-card');


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

        const parentCard = movableCard.parentElement?.closest(".tableu-card")

        if (!parentCard?.object) return allowTableuMove;
        
        if (
            movePair.object.value !== parentCard.object.value ||
            movePair.object.color !== parentCard.object.color
        ) {
            return allowTableuMove;
        }

        for (const pile of foundationPile) {
            if (
                parentCard.object.value === pile.lastElementChild?.object?.value + 1 &&
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
            ) continue;
        
        for (const movePair of foundationCards) {
            for (const pile of foundationPile) {
            if (
                movePair.object.value === movableCard.object.value - 1 &&
                movePair.object.suit === movableCard.object.suit
            ) {
                tableuToFoundationMoveFound = true
                console.log("Tableu to foundation move found:", movableCard, movePair)
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
            ){
                wasteToTableuMoveFound = true
                console.log("Waste pile to tableu move found:", movableCard, movePair)
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
                wasteToFoundationMoveFound = true
                console.log("Waste pile to foundation move found:", movableCard, movePair)
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
            ){
                stockToTableuMoveFound = true
                console.log("Stock pile to tableu move found:", movableCard, movePair)
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
                stockToFoundationMoveFound = true
                console.log("Waste pile to foundation move found:", movableCard, movePair)
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
                    !movableCard.previousElementSibling?.classList.contains("empty-column") // Blocks a move if a king is already in an empty column
                ) {
                    kingToEmptyColumnMoveFound = true
                    console.log("Tableu king to empty column move found:", movableCard, column)
                }
            }
            
            for (const movableCard of wasteCards) {
                if (movableCard.object.value === 13)
                    {
                    kingToEmptyColumnMoveFound = true
                    console.log("Waste pile king to empty column move found:", movableCard, column)
                }
            }

            for (const movableCard of stockCards) {
                if (movableCard.object.value === 13)
                    {
                    kingToEmptyColumnMoveFound = true
                    console.log("Stock pile king to empty column move found:", movableCard, column)
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
                    aceToEmptyFoundationMoveFound = true
                    console.log("Tableu ace to empty column move found:", movableCard, pile)
                }
            }
            
            for (const movableCard of wasteCards) {
                if (
                    movableCard.object.value === 1 &&
                    movableCard.object.suit === pile.dataset.suit
                )
                    {
                    aceToEmptyFoundationMoveFound = true
                    console.log("Waste pile ace to empty column move found:", movableCard, pile)
                }
            }

            for (const movableCard of stockCards) {
                if (movableCard.object.value === 1 &&
                    movableCard.object.suit === pile.dataset.suit
                )
                    {
                    aceToEmptyFoundationMoveFound = true
                    console.log("Stock pile ace to empty column move found:", movableCard, pile)
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

    if (movesAvailable === false) {
        alert("No more moves available.");
    }

    return movesAvailable;
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
