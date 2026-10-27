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

//TABLEU TURN CARD AROUND
//========================================================

