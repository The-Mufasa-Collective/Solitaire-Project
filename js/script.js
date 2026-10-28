/*
*   Main method
*   responsible for setup and cleanup of the game for restarts
*/
function main() {
    let gameDeck = [];

    gameDeck = createStartingDeck();

    gameLoop(gameDeck);
}

/*
*   game loop method
*   responsible for playing the game, 
*   i.e: react to player input and serve card, track score, ect
*/
function gameLoop(gameDeck) {
    console.log(gameDeck);

    renderStock(gameDeck)
    gameDeck[0].hidden = false;
    serveCardToColumn(gameDeck[0], "column-1");
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
main();