//run the game
main();

/*
*   Main method
*   responsible for setup and cleanup of the game
*/
function main() {
    let gameDeck = [];

    gameDeck = populateDeck();
}

/*
*   game loop method
*   responsible for playing the game
*/
function gameLoop(gameDeck) {
    console.log(gameDeck);
}

// create a fresh deck of cards and shuffles it
function populateDeck() {
    let deck = [];

    for(i = 0; i < 13; i++) {
        deck.push({
            value: i + 1,
            suit: "Spades"
        });
        deck.push({
            value: i + 1,
            suit: "Hearts"
        });
        deck.push({
            value: i + 1,
            suit: "Diamonds"
        });
        deck.push({
            value: i + 1,
            suit: "Clubs"
        });
    }
    shuffleCardDeck(deck)
    return deck;
}

function shuffleCardDeck(deck) {
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
}