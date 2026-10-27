//TABLEU DRAG AND DROP
//========================================================

const columns = document.querySelectorAll('.column'); 
let selected = null; 

for (const column of columns) { 

    const bottomCard = column.lastElementChild;

    column.addEventListener("dragstart", function(e) { 

        if (e.target !== column.lastElementChild) {
            e.preventDefault(); 
        }
        selected = e.target; 
    });

/*    column.addEventListener("dragover", function(e) { 
        e.preventDefault(); 
    }); */

column.addEventListener("dragover", function(e) {
  //  if (column.children.length >= 2) {
  //    e.preventDefault(); } else 
    if (column.children.length === 1 && selected === diamondKing) {
        e.preventDefault();
    } else if (
        bottomCard?.object &&
        selected?.object &&
        column.lastElementChild.object.number === selected.object.number + 1 && 
        column.lastElementChild.object.color !== selected.object.color) {
        e.preventDefault();
    }
});

    column.addEventListener("drop", function() { 
        if (selected) { 
            column.appendChild(selected);
            // column.lastElementChild.appendChild(selected);
            selected = null; 
            revealedCardDirection();
        }
    });
};

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

