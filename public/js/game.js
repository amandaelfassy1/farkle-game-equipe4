const chatUl = document.querySelector(".game");
console.log("game!");

let diceArr = [];
let score = 0;
let winningDice = [];
let turnNumberElement = document.getElementById("turn-number");
let turnNumber = parseInt(turnNumberElement.innerHTML);
let losingDice = [];

// Initialization of dice in objects
function initializeDice() {
    for (i = 0; i < 6; i++) {
        diceArr[i] = {};
        diceArr[i].id = "die" + (i + 1).toString()
        diceArr[i].value = i + 1;
        diceArr[i].winning = false; // The feature when 1 or 5 or triple number
    }
}

// Rolling dice
function rollDice() {
    for (let i = 0; i < 6; i++) {
        if (!diceArr[i].winning) { // Only roll non-winning dice
            diceArr[i].value = Math.floor(Math.random() * 6 + 1);
            losingDice.push(i);
        } else {
            console.log("ok");
        }
    }
    
    updateDiceImg();
    /*updateDiceBackground();*/
    getScore();
    document.getElementById("dice-remaining").textContent = losingDice.length;

}

// Change dice image when rolling dice
/*function updateDiceImg() {
    let diceImage;
    for (let i = 0; i < 6; i++) {
        diceImage = "/img/" + diceArr[i].value + ".png";
        document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
    }
}*/

function updateDiceImg() {
    let diceImage;
    for (let i = 0; i < 6; i++) {
        if (diceArr[i].winning && turnNumber >= 1) {
          diceImage = "/img/" + diceArr[i].value + "-barre.png";
          let die = document.getElementById(diceArr[i].id);
          die.setAttribute("src", diceImage);

        } else {
          diceImage = "/img/" + diceArr[i].value + ".png";    
          let die = document.getElementById(diceArr[i].id);
          die.setAttribute("src", diceImage);    
        }
    }
}

/*
[
  { id: 'die1', value: 2 },
  { id: 'die2', value: 5 },
  { id: 'die3', value: 3 },
  { id: 'die4', value: 5 },
  { id: 'die5', value: 2 },
  { id: 'die6', value: 1 }
]

to [1, 2, 2, 0, 0, 2] with getDiceAmounts

*/
function getDiceAmounts() {
    let valueArr = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) {
        valueArr[diceArr[i].value - 1]++;
    }
    return valueArr;
}

// if there a Farkle then the turn goes to the next player
function checkForFarkle() {
    let valueArr = getDiceAmounts();
    for (let i = 0; i < 6; i++) {
        if (valueArr[i] >= 3) {
            return;
        } else if (i == 0 && valueArr[i] > 0) {
            return;
        } else if (i == 4 && valueArr[i] > 0) {
            return;
        }
  }

  alert("FARKLE! Votre tour est fini !");
}

// Update the background of winning dice
/*function updateDiceBackground() {
    for (let i = 0; i < 6; i++) {
      if (diceArr[i].winning) {
        document.getElementById(diceArr[i].id).style.backgroundColor = "gray";
      } else {
        document.getElementById(diceArr[i].id).style.backgroundColor = "white";
      }
    }
}*/

function getScore() {
  let valueArr = getDiceAmounts();
  let score = 0;

  // Calculate score
  for (let i = 0; i < 6; i++) {
    switch (i) {
      case 0:
        if (valueArr[i] >= 3 && valueArr[i] < 6) {
          score += 1000;
          diceArr[i].winning = true;

          if (valueArr[i] - 3 == 1) {
            score += 100;
            diceArr[i].winning = true;
          } else if (valueArr[i] - 3 == 2) {
            score += 200;
            diceArr[i].winning = true;
          }
        } else if (valueArr[i] >= 6) {
          score += 2000;
          diceArr[i].winning = true;
        } else {
          score += valueArr[i] * 100;
          diceArr[i].winning = true;
        }
        break;

      case 1:
        if (valueArr[i] == 3) {
          score += 200;
          diceArr[i].winning = true;
        } else if (valueArr[i] == 6) {
          score += 400;
          diceArr[i].winning = true;
        }
        break;

      case 2:
        if (valueArr[i] == 3) {
          score += 300;
          diceArr[i].winning = true;
        } else if (valueArr[i] == 6) {
          score += 600;
          diceArr[i].winning = true;
        }
        break;

      case 3:
        if (valueArr[i] == 3) {
          score += 400;
          diceArr[i].winning = true;
        } else if (valueArr[i] == 6) {
          score += 800;
          diceArr[i].winning = true;
        }
        break;

      case 4:
        if (valueArr[i] >= 3 && valueArr[i] < 6) {
          score += 500;
          diceArr[i].winning = true;

          if (valueArr[i] - 3 == 1) {
            score += 50;
            diceArr[i].winning = true;
          } else if (valueArr[i] - 3 == 2) {
            score += 100;
            diceArr[i].winning = true;
          }
        } else if (valueArr[i] >= 6) {
          score += 1000;
          diceArr[i].winning = true;
        } else {
          score += valueArr[i] * 50;
          diceArr[i].winning = true;
        }
        break;

      case 5:
        if (valueArr[i] == 3) {
          score += 600;
          diceArr[i].winning = true;
        } else if (valueArr[i] == 6) {
          score += 1200;
          diceArr[i].winning = true;
        }
        break;
    }
  }

  document.getElementById("row-score").innerHTML = score;

  if (score == 0) {
    alert("FARKLE! Votre tour est fini !");
  }

  return score;
}


/*function getScore() {
  let valueArr = getDiceAmounts();
  let score = 0;
  
  const combinations = [
      { value: 1, count: 3, baseScore: 1000, additionalScore: 100 },
      { value: 1, count: 4, baseScore: 2000, additionalScore: 0 },
      { value: 1, count: 5, baseScore: 3000, additionalScore: 0 },
      { value: 1, count: 6, baseScore: 4000, additionalScore: 0 },
      { value: 2, count: 3, baseScore: 200, additionalScore: 0 },
      { value: 3, count: 3, baseScore: 300, additionalScore: 0 },
      { value: 4, count: 3, baseScore: 400, additionalScore: 50 },
      { value: 5, count: 3, baseScore: 500, additionalScore: 50 },
      { value: 5, count: 4, baseScore: 1000, additionalScore: 0 },
      { value: 5, count: 5, baseScore: 1500, additionalScore: 0 },
      { value: 5, count: 6, baseScore: 2000, additionalScore: 0 },
      { value: 6, count: 3, baseScore: 600, additionalScore: 0 },
  ];

  for (let combination of combinations) {
      if (valueArr[combination.value - 1] >= combination.count) {
          score += combination.baseScore;
          valueArr[combination.value - 1] -= combination.count;

          if (combination.additionalScore > 0) {
              let additionalCount = valueArr[combination.value - 1];
              let additionalScore = additionalCount * combination.additionalScore;
              score += additionalScore;
              valueArr[combination.value - 1] = 0;
          }
      }
  }

  // Add score for remaining 1's and 5's
  score += valueArr[0] * 100;
  score += valueArr[4] * 50;

  // Mark winning dice
  for (let i = 0; i < 6; i++) {
      if (diceArr[i].winning) continue;
      if (diceArr[i].value === 1 || diceArr[i].value === 5) {
          diceArr[i].winning = true;
      }
  }

  return score;
}*/

// The reset function will be called at the end of the game
function resetGame() {
    diceArr = [];
    score = 0;
    initializeDice();
    updateDiceImg();
    document.getElementById("row-score").innerHTML = score;
    document.getElementById("player1-score").innerHTML = 0;
    document.getElementById("player2-score").innerHTML = 0;
    document.getElementById("turn-number").innerHTML = 1;
}

function bankScore() {

    let currentPlayer = (document.getElementById("turn-number").innerHTML % 2) + 1;
    let currentScore = getScore(); console.log("Player " + currentPlayer + " a " + currentScore + " points");

    let playerScoreElement = document.getElementById("player" + currentPlayer + "-score");
    let playerScore = parseInt(playerScoreElement.innerHTML);
    playerScore += currentScore;
    playerScoreElement.innerHTML = playerScore;


    turnNumber += 1;
    turnNumberElement.innerHTML = turnNumber;
    document.getElementById("dice-remaining").textContent = 6;
    losingDice = [];

    // Check for winner
    if (playerScore >= 3000) {
        let winner = "Player " + currentPlayer;
        alert(winner + " a gagné ! Voulez-vous rejouer ?");
        resetGame();
    }

    let diceImage;
    for (let i = 0; i < 6; i++) {
        diceImage = "/img/" + diceArr[i].value + ".png";    
        let die = document.getElementById(diceArr[i].id);
        die.setAttribute("src", diceImage);    
    } 


}

const socket = io({ query: `username=${username}` });
const submitBtn = document.querySelector(".submit");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const data = { from: username, message: sendInput.value };
  sendInput.value = "";
  socket.emit("game", data);
});
