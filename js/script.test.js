const test = require("node:test");
const assert = require("node:assert/strict");
const { Foundation } = require("./script");

function buildCard(rank, suit) {
  return { rank, suit };
}

test("foundation only accepts an ace on an empty pile", () => {
  const foundation = new Foundation();

  assert.equal(foundation.canAccept(buildCard("2", "hearts")), false);
  assert.equal(foundation.canAccept(buildCard("A", "hearts")), true);
});

test("foundation accepts cards in ascending order for the same suit", () => {
  const foundation = new Foundation();

  assert.equal(foundation.addCard(buildCard("A", "hearts")), true);
  assert.equal(foundation.canAccept(buildCard("2", "clubs")), false);
  assert.equal(foundation.canAccept(buildCard("3", "hearts")), false);
  assert.equal(foundation.canAccept(buildCard("2", "hearts")), true);
});

test("foundation can be completed from ace to king", () => {
  const foundation = new Foundation("spades");
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  for (const rank of ranks) {
    assert.equal(foundation.addCard(buildCard(rank, "spades")), true);
  }

  assert.equal(foundation.isComplete(), true);
});
