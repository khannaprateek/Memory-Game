function activeObj() {
  this.src = null;
  this.obj = null;
}
let mins = 0;
let secs = 0;
let currentActive = new activeObj();
let prevActive = new activeObj();
let numOfFlips = 0;
let updTimer;
let mainBody = document.querySelector("#mainbody");
let startButton = document.querySelector("button");

const lst = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
let shuffledLst;

startButton.setAttribute("id", "startButton");
startButton.addEventListener("click", startGame);

let buttons = {
  start: ["startButton", "startGame"],
  end: ["endButton", "endGame"],
};

function startGame() {
  let caption = document.querySelector("h1");
  caption.textContent = "Lets see how quick you can be !!";
  mainBody.appendChild(caption);
  shuffleList();
  let gameBoard = document.createElement("div");
  gameBoard.setAttribute("id", "gameBoard");
  mainBody.appendChild(gameBoard);

  let endGameButton = createButton("endButton", "End Game", endGame);
  mainBody.appendChild(endGameButton);

  for (let i = 0; i < 16; i++) createCard(gameBoard, i);
  let startButton = document.querySelector("#startButton");
  startButton.remove();

  let timer = createTimer();
  mainBody.appendChild(timer);
  updTimer = setInterval(updateTimer, 1000);
}

function createCard(gameBoard, index) {
  let scene = document.createElement("div");
  scene.setAttribute("class", "scene");

  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.addEventListener("click", flipTheCard);

  scene.appendChild(card);
  gameBoard.appendChild(scene);

  const frontCard = document.createElement("div");
  frontCard.setAttribute("class", "card card__face--front");
  card.appendChild(frontCard);

  const backCard = document.createElement("div");
  backCard.setAttribute("class", "card card__face--back");
  assignImage(backCard, index);
  card.appendChild(backCard);
}

function endGame() {
  let endButton = document.querySelector("#endButton");
  let gameBoard = document.querySelector("#gameBoard");

  gameBoard.remove();
  endButton.remove();

  clearTimer();

  let caption = document.querySelector("h1");
  caption.textContent = "You can always start a new game!!";
  mainBody.appendChild(caption);

  let startGameButton = createButton("startButton", "Start Game", startGame);
  mainBody.appendChild(startGameButton);
}

function createButton(buttonId, text, clickFunction) {
  let button = document.createElement("button");
  button.setAttribute("id", buttonId);
  button.textContent = text;
  button.addEventListener("click", clickFunction);
  return button;
}

function assignImage(backcard, i) {
  let image = document.createElement("img");
  image.setAttribute("src", `img\\${shuffledLst[i]}.jpeg`);
  image.setAttribute("class", "card");
  backcard.appendChild(image);
}

function shuffleList() {
  shuffledLst = [...lst];
  let randomIndex;
  for (let i = 0; i < 16; i++) {
    randomIndex = Math.floor(Math.random() * lst.length);
    [shuffledLst[randomIndex], shuffledLst[i]] = [
      shuffledLst[i],
      shuffledLst[randomIndex],
    ];
  }
}

function flipTheCard() {
  numOfFlips++;
  this.classList.toggle("is-flipped");

  if (prevActive.src === null) {
    prevActive.src = this.childNodes[1].childNodes[0].getAttribute("src");
    prevActive.obj = this;
  } else if (prevActive.obj === this) {
    prevActive = new activeObj();
  } else {
    currentActive.src = this.childNodes[1].childNodes[0].getAttribute("src");
    currentActive.obj = this;

    if (currentActive.src === prevActive.src) {
      currentActive.obj.removeEventListener("click", flipTheCard);
      prevActive.obj.removeEventListener("click", flipTheCard);
      console.log("Matched");
      deleteFromLst(currentActive.src);

      if (shuffledLst.length === 0) setTimeout(userWon, 1050);
    } else setTimeout(resetCards, 800, prevActive, currentActive);

    currentActive = new activeObj();
    prevActive = new activeObj();

    console.log(prevActive, currentActive);
  }
}

function resetCards(prevActive, currentActive) {
  prevActive.obj.classList.remove("is-flipped");
  currentActive.obj.classList.remove("is-flipped");
}

function deleteFromLst(currentActiveSrc) {
  let num = +currentActiveSrc[0];
  shuffledLst.splice(shuffledLst.indexOf(num), 1);
  shuffledLst.splice(shuffledLst.indexOf(num), 1);

  console.log("Deleted", shuffledLst);
}
//shuffleList(lst);

function createTimer() {
  let timer = document.createElement("p");
  timer.textContent = `0${mins}:0${secs}`;
  timer.setAttribute("id", "timer");

  return timer;
}

function updateTimer() {
  secs++;
  if (secs > 59) {
    mins++;
    secs = 0;
  }
  let secsStr = secs < 10 ? "0" + secs : secs;
  let minsStr = mins < 10 ? "0" + mins : mins;

  let timer = document.querySelector("#timer");
  timer.textContent = `${minsStr}:${secsStr}`;
  mainBody.appendChild(timer);
}
function clearTimer() {
  let timer = document.querySelector("#timer");
  clearInterval(updTimer);
  timer.remove();
  secs = mins = 0;
}

function userWon() {
  let time = document.querySelector("#timer").textContent;
  time =
    time.slice(0, 2) === "00"
      ? `${time.slice(3)}secs`
      : `${time.slice(0, 2)}mins and ${time.slice(3)} secs`;

  alert(
    `Congratulations you have won in ${time} and performed ${numOfFlips} flips`
  );
  endGame();
}
