//variabele declaraties ----------------------------------------
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const game = document.getElementById("game");
const startButton = document.getElementById("start");
const pregamestartbutton = document.getElementById("pregamestart");
let input = document.getElementById("spelerTimeInput");
    console.log(input);

let time;
let timer;
let berrySpawnInterval;

const aantalGaatjes = 16;
let score = 0;
let gameStarted = false;
let result = document.getElementById("result");

const berryhitaudio = new Audio("audio/berryclick.mp3");
const berryslapaudio = new Audio("audio/berryslap.mp3");
const gameoveraudio = new Audio("audio/gameover.mp3");
const backgroundmusic = new Audio("audio/backgroundmusic.mp3");
    backgroundmusic.volume = 0.05;
//--------------------------------------------------------------


//validateinput functie ----------------------------------------
function validateInput() {
  if (input.value < 1 || input.value > 60) {
    alert("Time must be between 1 and 60");
    return false;
  }
  return true;
}
//--------------------------------------------------------------


//index.html game setup functie --------------------------------
if (pregamestartbutton) {
  pregamestartbutton.addEventListener("click", function () {
    if (validateInput()) {
      localStorage.setItem("inputValue", input.value); //copilot line
      window.location.href = "game.html";
    }
  });
}
//--------------------------------------------------------------


//timerfunctie -------------------------------------------------
function updateTimer() {
  console.log("Updating timer", timerDisplay, time);
  timerDisplay.textContent = time;
  if (time < 1) {
    endGame();
  } else {
    time--;
  }
}
//---------------------------------------------------------------


//multi-html value transfer functie -----------------------------
function inputvaluetransfer() {
  if (window.location.href.indexOf("game.html") > -1) { // copilot line
    time = parseInt(localStorage.getItem("inputValue"), 10);
    updateTimer();
  }
};
window.onload = inputvaluetransfer;
//---------------------------------------------------------------


//gameboard creationfunctie -------------------------------------
for (let i = 0; i < aantalGaatjes; i++) {
  const hole = document.createElement("div");
  hole.classList.add("hole");
  hole.id = `hole${i}`;
  game.appendChild(hole);

  const berry = document.createElement("div");
  berry.classList.add("berry");
  hole.appendChild(berry);

  berry.addEventListener("click", whack);
}
//---------------------------------------------------------------


//randomhole functie --------------------------------------------
function randomHole() {
  const gekozengaatje = Math.floor(Math.random() * aantalGaatjes);
  return document.getElementById(`hole${gekozengaatje}`);
}
//---------------------------------------------------------------


//berry spawn functie -------------------------------------------
function spawnBerry() {
  const berrys = document.querySelectorAll(".berry");
  berrys.forEach((berry) => {
    berry.style.visibility = "hidden";
    berry.classList.remove("avatarBerry");
    berry.classList.remove("peek");
  });

  berry = berrys[Math.floor(Math.random() * berrys.length)];

  if (Math.random() < 0.1) {
    berry.classList.add("avatarBerry");
  }
  berry.classList.add("peek");
  berry.style.visibility = "visible";
}
//---------------------------------------------------------------


//startgame functie ---------------------------------------------
function startGame() {
  if (gameStarted) {
    return;
  }
  gameStarted = true;
  backgroundmusic.play();
  result.style.visibility = "hidden";
  clearInterval(timer);
  time = parseInt(localStorage.getItem("inputValue"), 10);

  updateTimer();
  timer = setInterval(updateTimer, 1000);
  clearInterval(berrySpawnInterval);
 
  berrySpawnInterval = setInterval(spawnBerry, 1000);
}
//---------------------------------------------------------------


//endgame functie -----------------------------------------------
function endGame() {
  gameStarted = false;
  backgroundmusic.pause();
  backgroundmusic.currentTime = 0; //backgroundmusic opgezocht https://stackoverflow.com/questions/17636310/play-audio-and-restart-it-onclick
  clearInterval(berrySpawnInterval);
  clearInterval(timer);
  timerDisplay.textContent = "Game Over Beertje!";
  gameoveraudio.play();

  const berrys = document.querySelectorAll(".berry");
  berrys.forEach(function (berry) {
    berry.style.visibility = "hidden";
    berry.classList.remove("avatarBerry");
  });
  let result = document.getElementById("result");
  result.textContent = "Time is up!";
  result.style.visibility = "visible";
}
//---------------------------------------------------------------


//whack functie -------------------------------------------------
function whack(e) { //Event functie met behulp van copilot geschreven
  console.log("Hit!", e);
  score++;
  berryslapaudio.play();
  if (e.target.classList.contains("avatarBerry")) {
    score += 2;
    berryhitaudio.play();
  }

  scoreDisplay.textContent = `Score: ${score}`;
  e.target.style.visibility = "hidden";
  e.target.classList.remove("peek");
}

startButton.addEventListener("click", function () {
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  startGame();
});
//----------------------------------------------------------------

//uitleg aan copilot gevraagd over; Template literals, hele classlist principe, audio en localstorage functies,

//Als ik er nog langer aan kon doorwerken:
  // - Een highscore/personal record systeem
  // - on hit animaties 
  // - animaties, etc perfectioneren
  // - misschien meer instelbare factoren maken zoals hoe snel berry spawnt en misschien zelf kiezen welke geluiden afspelen