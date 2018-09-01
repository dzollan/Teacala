/*constants*/
const turnMsg = ["It is player zero's turn.", "It is player one's turn."];
const winMsg = ["Player zero wins!", "Player one wins!"];

/*globals*/
var turn;
var board;

/*generic random function*/
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


/** @function setupGame
 * Clears anything on the board, and sets up play for a new game.
 */

function setupGame() {
  var tokens = document.getElementsByClassName('token');

  while (tokens[0]) {
    tokens[0].parentNode.removeChild(tokens[0]);
  }

  turn = 0;
  board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]; //Initial piles

  drawBoard();
  document.getElementById("ui").innerText = turnMsg[0];

}

function setCount(singleCup) { //sets text to array value}
  var cupNum = singleCup.id.replace(/^\D+/g, '');
  var description = singleCup.firstChild;
  description.textContent = board[cupNum].toString();
}

function drawBoard() {
  var cups = Array.from(document.getElementsByClassName('cup'));

  //Create all piles :o
  var i, j;
  for (i = 0; i < 14; i++) {
    var cupEl = document.getElementById('cup-' + i);
    for (j = 0; j < board[i]; j++) {
      var token = document.createElement('div');
      var randomR = getRndInteger(0, 360);
      var randomX = getRndInteger(5, 100);
      var randomY = getRndInteger(15, 180);

      token.classList.add("token");
      cupEl.appendChild(token);
      token.style.webkitTransform = 'rotate(' + randomR + 'deg)';
      token.style.mozTransform = 'rotate(' + randomR + 'deg)';
      token.style.msTransform = 'rotate(' + randomR + 'deg)';
      token.style.oTransform = 'rotate(' + randomR + 'deg)';
      token.style.transform = 'rotate(' + randomR + 'deg)';
      token.style.position = 'absolute';
      token.style.left = randomX + 'px';
      token.style.top = randomY + 'px';
    }

  }

  cups.forEach(setCount);
}


function bye(bParent, bChild) {

  bParent.removeChild(bChild);
}

function removeToken(pouch) {
  thisCup = document.getElementById('cup-' + pouch);
  if (thisCup.firstElementChild) {
    thisToken = thisCup.firstElementChild;
    thisCup.removeChild(thisToken);
  }
}


function placeToken(toPouch, finalToken) {
  thisCup = document.getElementById('cup-' + toPouch);
  thisToken = document.createElement('div');
  var randomR = getRndInteger(0, 360);
  var randomX = getRndInteger(5, 100);
  var randomY = getRndInteger(15, 180);
  if (toPouch == 6 || toPouch == 13) {
    randomY *= 1.5;
  }
 board[toPouch]++;
  thisToken.classList.add("token");
  thisCup.appendChild(thisToken);
  thisToken.style.webkitTransform = 'rotate(' + randomR + 'deg)';
  thisToken.style.mozTransform = 'rotate(' + randomR + 'deg)';
  thisToken.style.msTransform = 'rotate(' + randomR + 'deg)';
  thisToken.style.oTransform = 'rotate(' + randomR + 'deg)';
  thisToken.style.transform = 'rotate(' + randomR + 'deg)';
  thisToken.style.position = 'absolute';
  thisToken.style.left = randomX + 'px';
  thisToken.style.top = randomY + 'px';
  if (finalToken) {
    if (board[toPouch] == 1) {
      if ((!turn && toPouch < 6) || (turn && toPouch > 6)) {
        var opp = 12 - toPouch;
        var pp;
        for (pp = 0; pp < board[opp]; pp++) {
          removeToken(opp);
          if(opp>6){
            placeToken(6,0);
          }
          else{
            placeToken(13,0);
          }
        }
        board[opp]=0;
      }
      else if((!turn && toPouch == 6) || (turn && toPouch == 13)) {
        turn ^= true;
      }
    }
  checkForWin();
  }



}

function makeMove(pouchNum) {
  if ((!turn && pouchNum < 6) || (turn && pouchNum > 6)) { //Legal pouch?
    if (board[pouchNum]) { //pouch isn't empty...
      var iter, final;
      for (iter = 0; iter < board[pouchNum]; iter++) {
        var destinationPouch = pouchNum + iter + 1;
        if (destinationPouch > 13) { //loop-dee-do [fix going too far]
          destinationPouch -= 14;
        }
        if ((destinationPouch == 6 && turn) || (destinationPouch == 13 && !turn)) { //don't drop in opp's mancala
          if (turn) {
            destinationPouch++;
          } else {
            destinationPouch = 0; //fix overlapping again.
          }
        }
        //Okay! We passed the tests and know what pouch we are dropping in.
        final = board[pouchNum] - iter == 1; //final token??
        removeToken(pouchNum);
        placeToken(destinationPouch, final);

      }
      board[pouchNum] = 0;
      var cups = Array.from(document.getElementsByClassName('cup'));
      cups.forEach(setCount);
      turn ^= true;
      document.getElementById("ui").innerText = turnMsg[turn];

    } else {
      //pouch empty
    }
  } else {
    //clicked wrong pouch
  }
}

function checkForWin(){
  var itr, ibb;
  if(!turn){
    for(itr = 0; itr <6; itr++){
      if(board[itr]){
        return;
      }
    }
  }
  else{
    for(itr = 7; itr <13; itr++){
      if(board[itr]){
        return;
      }
    }
  }

  if(!turn){
    for(itr = 0; itr <6; itr++){
      for(ibb = 0)(board[itr]){
        return;
      }
    }
  }
  else{
    for(itr = 7; itr <13; itr++){
      if(board[itr]){
        return;
      }
    }
  }

}

// Attach click listeners to all 12 pouches
for (var p = 0; p < 14; p++) {
  if (p != 6 && p != 13) {
    const pouch = p;
    document.getElementById('cup-' + pouch)
      .addEventListener('click', function(event) {
        event.preventDefault();
        makeMove(pouch);
      });
  }
}
