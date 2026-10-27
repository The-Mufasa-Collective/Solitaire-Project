const columns = document.querySelectorAll('.column'); // Selects every element with class column
const cards = document.querySelectorAll('.column-box');
let selected = null; // Defines selected but leaves it empty so nothing is selected automatically


for (const column of columns) {  // Loops over the columns collection and assigns individual columns as variables named column (this is so that the last child of each column can be chosen later instead of the last child of all columns)
    for (const card of cards) {

    column.addEventListener("dragstart", function(e) {  // Listens for an element inside column set to be draggabele to be start being dragged

        if (e.target !== column.lastElementChild) { // If the element is not the last child of a column...
            e.preventDefault(); // ...prevent the element from being dragged
            return; // Exits the dragstart handler so that selected is not set for an element that isn't the last child; this prevents dragstart event from happening to a non-last child.
        }
        selected = e.target; // Changes the selected variable from null to being the target of the drag event
    });

    column.addEventListener("dragover", function(e) { // Runs when the dragged element is over an element that we want to allow a drop for
        e.preventDefault(); // Allows a dragged object to be dropped because the default of browsers is not to allow drops.
    });

    column.addEventListener("drop", function() { // Function for how the drop should behave.
        if (selected) { // If the element is the variable named selected set to be a dragstart event target...
            column.appendChild(selected); // ...dropping it will be appended to the column div with an active dragover event under it at drop.
            // column.lastElementChild.appendChild(selected);  // This will instead nest the dropped element inside the last child 
            selected = null; // After being dropped, selected returns to being null instead of the target of the drag event.
        }
    });
}};