const foundationPile= document.querySelectorAll(".foundation"); //holds the 4 foundation boxes
let selected= null; //will hold the card in hand

//test cards info
const heartsAce = { color: "red", suit: "hearts", number: 1 };

const heartsTwo= { color:"red", suit: "hearts", number: 2 };

const heartsThree= { color: "red", suit:"hearts", number: 3 };

const clubsAce = { color: "black", suit: "clubs", number: 1 };

//attaches each cards info to its element in the html page. also, so the code can read card.object.number later
const heartsAceElement = document.getElementById("hearts-ace");
heartsAceElement.object = heartsAce;

const heartsTwoElement= document.getElementById("hearts-two");
heartsTwoElement.object = heartsTwo;

const heartsThreeElement = document.getElementById("hearts-three");
heartsThreeElement.object = heartsThree;

const clubsAceElement = document.getElementById("clubs-ace");
clubsAceElement.object = clubsAce;
