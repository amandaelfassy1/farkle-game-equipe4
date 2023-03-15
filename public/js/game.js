const chatUl = document.querySelector(".game");
console.log("game!");

let diceArr = [];
let score = 0;

function initializeDice() {
  for (i = 0; i < 6; i++) {
    diceArr[i] = {};
    diceArr[i].id = "die" + String(i + 1);
    diceArr[i].value = i + 1;
    diceArr[i].clicked = 0;
  }
}

initializeDice();

function rollDice() {
  for (let i = 0; i < 6; i++) {
    if (diceArr[i].clicked === 0) {
      diceArr[i].value = Math.floor(Math.random() * 6 + 1);
    }
  }
  updateDiceImg();
  getScore();
}

function updateDiceImg() {
  let diceImage;
  for (let i = 0; i < 6; i++) {
    diceImage = "/img/" + diceArr[i].value + ".png";
    document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
  }
}

function diceClick(img) {
  let i = img.getAttribute("data-number");
  img.classList.toggle("transparent");
  if (diceArr[i].clicked === 0) {
    diceArr[i].clicked = 1;
  } else {
    diceArr[i].clicked = 0;
  }
}

function getDiceAmounts() {
  let valueArr = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 6; i++) {
    valueArr[diceArr[i].value - 1]++;
  }
  return valueArr;
}

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

  alert("OOOHHH, Nous avons un FARKLE! Votre tour est fini !");
}

function getScore(losingDice) {
  let valueArr = getDiceAmounts();
  let score = 0;

  // Filter out losing dice
  if (losingDice && losingDice.length > 0) {
    valueArr = valueArr.filter((_, index) => !losingDice.includes(index + 1));
  }

  // Calculate score
  for (let i = 0; i < 6; i++) {
    if (i == 0 && valueArr[i] >= 3 && valueArr[i] < 6) {
      score += 1000;
      if (valueArr[i] - 3 == 1) {
        score += 100;
      } else if (valueArr[i] - 3 == 2) {
        score += 200;
      }
    } else if (i == 0 && valueArr[i] >= 6) {
      score += 2000;
    } else if (i == 0) {
      score += valueArr[i] * 100;
    } else if (i == 4 && valueArr[i] >= 3 && valueArr[i] < 6) {
      score += 500;
      if (valueArr[i] - 3 == 1) {
        score += 50;
      } else if (valueArr[i] - 3 == 2) {
        score += 100;
      }
    } else if (i == 4 && valueArr[i] >= 6) {
      score += 1000;
    } else if (i == 4) {
      score += valueArr[i] * 50;
    } else if (i == 1 && valueArr[i] == 3) {
      score += 200;
    } else if (i == 2 && valueArr[i] == 3) {
      score += 300;
    } else if (i == 3 && valueArr[i] == 3) {
      score += 400;
    } else if (i == 5 && valueArr[i] == 3) {
      score += 600;
    } else if (i == 1 && valueArr[i] == 6) {
      score += 400;
    } else if (i == 2 && valueArr[i] == 6) {
      score += 600;
    } else if (i == 3 && valueArr[i] == 6) {
      score += 800;
    } else if (i == 5 && valueArr[i] == 6) {
      score += 1200;
    }
  }

  document.getElementById("row-score").innerHTML = score;

  if (score == 0) {
    alert("UH OH, we have a FARKLE! Your turn is over!");
  }

  return score;
}

function bankScore() {
  let currentPlayer =
    (document.getElementById("turn-number").innerHTML % 2) + 1;
  let currentScore = getScore();
  console.log("Player " + currentPlayer + " a " + currentScore + " points");

  let playerScoreElement = document.getElementById(
    "player" + currentPlayer + "-score"
  );
  let playerScore = parseInt(playerScoreElement.innerHTML);
  playerScore += currentScore;
  playerScoreElement.innerHTML = playerScore;

  let turnNumberElement = document.getElementById("turn-number");
  let turnNumber = parseInt(turnNumberElement.innerHTML);
  turnNumber += 1;
  turnNumberElement.innerHTML = turnNumber;
}

const socket = io({ query: `username=${username}` });
const submitBtn = document.querySelector(".submit");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const data = { from: username, message: sendInput.value };
  sendInput.value = "";
  socket.emit("game", data);
});
