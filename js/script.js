//DRAG AND DROP WITHIN TABLEU
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

