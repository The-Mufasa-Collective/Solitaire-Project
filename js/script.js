const FOUNDATION_SIZE = 13;

function getRankValue(rank) {
  if (typeof rank === "number" && Number.isInteger(rank) && rank >= 1 && rank <= FOUNDATION_SIZE) {
    return rank;
  }

  if (typeof rank !== "string") {
    return null;
  }

  const normalizedRank = rank.trim().toUpperCase();
  const rankOrder = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const rankIndex = rankOrder.indexOf(normalizedRank);

  return rankIndex === -1 ? null : rankIndex + 1;
}

class Foundation {
  constructor(suit = null) {
    this.suit = suit;
    this.cards = [];
  }

  topCard() {
    if (this.cards.length === 0) {
      return null;
    }

    return this.cards[this.cards.length - 1];
  }

  canAccept(card) {
    if (!card || typeof card !== "object" || !card.suit) {
      return false;
    }

    const incomingRank = getRankValue(card.rank ?? card.value);
    if (incomingRank === null) {
      return false;
    }

    if (this.cards.length === 0) {
      const suitMatches = this.suit === null || this.suit === card.suit;
      return suitMatches && incomingRank === 1;
    }

    const currentTopCard = this.topCard();
    const topRank = getRankValue(currentTopCard.rank ?? currentTopCard.value);

    return card.suit === currentTopCard.suit && incomingRank === topRank + 1;
  }

  addCard(card) {
    if (!this.canAccept(card)) {
      return false;
    }

    if (this.suit === null) {
      this.suit = card.suit;
    }

    this.cards.push(card);
    return true;
  }

  removeCard() {
    return this.cards.pop() ?? null;
  }

  isComplete() {
    return this.cards.length === FOUNDATION_SIZE;
  }
}

if (typeof window !== "undefined") {
  window.Foundation = Foundation;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Foundation, getRankValue };
}