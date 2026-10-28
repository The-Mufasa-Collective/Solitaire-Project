const stockPile = document.querySelector('#stock')
const wastePile = document.querySelector('#waste')


//STOCK PILE CARD DIRECTION

function stockPileCardDirection() {
    const cardsInStock = stockPile.querySelectorAll('.stock-card');

    for (const card of cardsInStock) {
            card.classList.add('back');
        }
        }

        stockPileCardDirection();

function wastePileCardDirection() {
    const cardsInWaste = wastePile.querySelectorAll('.waste-card');

    for (const card of cardsInWaste) {
            card.classList.remove('back');
        }
        }

        wastePileCardDirection();

//CLICK TO MOVE STOCK CARD TO MESS PILE

stockPile.addEventListener("click", function(e) {
    if (e.target === stockPile.lastElementChild) {
        wastePile.appendChild(e.target);
        e.target.classList.add('waste-card');
        wastePileCardDirection();
}});