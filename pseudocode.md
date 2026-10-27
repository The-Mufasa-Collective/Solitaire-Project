## HTML & CSS
- Div containing the undraggable div
- Undraggable div as the first child wherever cards get dropped so that the append event doesn't throw an error
- Draggable divs for every card placement of the initial set-up? Or create the divs with JS and append them to the main div?

## CARD CREATION

## CARD DISTRIBUTION

## SHUFFLE

## FOUNDATION
- Cards are always face up

### If empty
- Prevent drop if the card is not an ace

### If not empty
- Prevent drop if the dragged card is not of the same type
- Prevent drop if the dragged card is not one number higher than the last child in deck
- Allow last child to be dragged out to tableu columns

## TABLEU
- At game start, only the top card in the column are face up.
- When a card is dragged and dropped to another column or the foundation, a card under it gets turned face up if it wasn't face up already.

### If empty
- Prevent a card/stack where the first child is not a King from being dropped

### If not empty
- Prevent a card/stack where the first child is not a different type than the current last child of the column from being dropped
- Prevent a card/stack where the first child is not one number higher than the current last child of the column from being dropped

### Dragging and dropping a single card: 
- Prevent drag and drop if the card isn't the last child of the column

### A stack of cards
- Ignore the last child rule and allow drag and drop of multiple nested cards up until a card that is of the same color or/and is not one number higher than the first child of a stack with ascending numbers from bottom to top and alternating colors
- If the last child of the drop column is of different type and is one number higher, append to the last child NOT the column
- If the last child of a column is a stack of multiple card, the drag target should target the card closest to cursor and the cards below it inside the stack (if card number is below the grabbed card's number and the element is a sibling of element?)

## STACK PILE
- All cards are backside up at all times
- Clicking the stack pile moves the top card to the mess pile 
- You can click the stack pile until it is empty

## MESS PILE
- All cards received from the stack pile are automatically turned face up as they arrive to the mess pile
- 3 stacked cards can be visible at the same time
- No dragover and drop event: The default is to not accept a drop
- Allow dragging the last child
- Clicking the empty pile (with a reload icon?) returns all the mess pile cards, that were not dragged to the tableu or the foundation, back to the mess pile in their original order (no shuffle)

## POINT COUNTING

## LOCAL STORAGE