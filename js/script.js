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
    if (e.target === stockPile.lastElementChild
    ) {
        wastePile.appendChild(e.target);
        e.target.classList.remove('stock-card');
        e.target.classList.add('waste-card');
        e.target.setAttribute('draggable', true);
        wastePileCardDirection();
    } else if (e.target === stockPile &&
        stockPile.children.length === 0 &&
        wastePile.children.length > 0
    ) {
    while (wastePile.lastElementChild
    ) {
    const returningCard = wastePile.lastElementChild;
    returningCard.classList.remove('waste-card');
    returningCard.classList.add('stock-card');
    returningCard.setAttribute('draggable', false);
    stockPile.appendChild(returningCard);
  }

  stockPileCardDirection();
}
});