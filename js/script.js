const foundationPile= document.querySelectorAll(".foundation"); //holds the 4 foundation boxes
let selected= null; //will hold the card in hand

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
const allCards = document.querySelectorAll(".tableu-card");
for (const card of allCards) {
    card.addEventListener("dragstart", function() {
        selected = card;
    });
}

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
                selected = null;                    //hand is emtpy now
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
//TABLEU DRAG AND DROP
//========================================================

const columns = document.querySelectorAll('.column'); 
let selected = null; 
let selectedStack = [];
const foundationPile = document.querySelectorAll('.foundation')

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
    } else if (
        selected &&
        e.target.closest(".tableu-card")?.object &&
        e.target.closest(".tableu-card").object.number === selected.object.number + 1 &&
        e.target.closest(".tableu-card").object.color !== selected.object.color
    ) {
        e.target.closest(".tableu-card").appendChild(selected);
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

function revealedCardDirection() { // Needs to be called after drop event
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
    number: 13,
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

