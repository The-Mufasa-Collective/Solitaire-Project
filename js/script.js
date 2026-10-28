//TABLEU DRAG AND DROP
//========================================================

const columns = document.querySelectorAll('.column'); 
let selected = null; 
let selectedStack = [];

for (const column of columns) { 

    const bottomCard = column.lastElementChild;

    column.addEventListener("dragstart", function(e) { 

        /* if (e.target !== column.lastElementChild) {
            e.preventDefault(); 
        } 
        selected = e.target.closest('.tableu-card'); */
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
        column.lastElementChild?.object &&
        selected?.object &&
        column.lastElementChild.object.number === selected.object.number + 1 &&
        column.lastElementChild.object.color !== selected.object.color
    ) {
        e.preventDefault();
    }
});

column.addEventListener("drop", function() {
    if (selected === diamondKing && column.children.length === 1) {
        column.appendChild(selected);
    } else if (selected && column.lastElementChild?.object) {
        column.lastElementChild.appendChild(selected);
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

