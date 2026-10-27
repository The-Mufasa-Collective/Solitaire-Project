//TABLEU DRAG AND DROP
//========================================================

const columns = document.querySelectorAll('.column'); 
let selected = null; 

for (const column of columns) { 


    column.addEventListener("dragstart", function(e) { 

        if (e.target !== column.lastElementChild) {
            e.preventDefault(); 
        }
        selected = e.target; 
    });

    column.addEventListener("dragover", function(e) { 
        e.preventDefault(); 
    });

    column.addEventListener("drop", function() { 
        if (selected) { 
            column.appendChild(selected);
            // column.lastElementChild.appendChild(selected);
            selected = null; 
        }
    });
};

//TABLEU CARD DIRECTIONS AT GAME START
//========================================================

function gameStartCardDirection() {
    for (const column of columns) {
        const cardsInColumn = column.querySelectorAll('.tableu-card');

        for (const card of cardsInColumn) {
            if (card === column.lastElementChild) {
                card.classList.remove('back');
            } else {
                card.classList.add('back');
            }
        }
    }
}

gameStartCardDirection();