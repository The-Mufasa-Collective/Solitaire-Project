//TABLEU DRAG AND DROP
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
    if (column.children.length === 1 && selected === diamondKing) {
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
    if (selected === diamondKing && column.children.length === 1) {
        column.appendChild(selected);
    } else if (
        selected &&
        e.target.closest(".tableu-card")?.object
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

const diamondKing = document.querySelector('#diamond-king')

diamondKing.object = {
    color: "red",
    suit: "diamonds",
    number: 13,
};

const spadesQueen = document.querySelector('#spades-queen')

spadesQueen.object = {
    color: "black",
    suit: "spades",
    number: 12,
};

const heartsJack = document.querySelector('#hearts-jack')
heartsJack.object = {
    color: "red",
    suit: "hearts",
    number: 11,
};

const clubsTen = document.querySelector('#clubs-ten')
clubsTen.object = {
    color: "black",
    suit: "clubs",
    number: 10,
};

