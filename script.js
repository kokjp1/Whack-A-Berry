let input = document.getElementById('spelerTimeInput');
console.log(input);
let time;
const timerDisplay = document.getElementById('timer');
let timer;
let berrySpawnInterval;
const aantalGaatjes = 16;
let score = 0;
const scoreDisplay = document.getElementById('score');
const game = document.getElementById('game');
const startButton = document.getElementById('start');
let gameStarted = false;

const berryhitaudio = new Audio('audio/berryclick.mp3');
const berryslapaudio = new Audio('audio/berryslap.mp3');
const gameoveraudio = new Audio('audio/gameover.mp3');
const backgroundmusic = new Audio('audio/backgroundmusic.mp3');
backgroundmusic.volume = 0.05;

function validateInput() {
    let input = document.getElementById('spelerTimeInput');
    if (input.value < 1 || input.value > 60) {
        alert('Time must be between 1 and 60');
        return false;
    }
    return true;
}

const pregamestartbutton = document.getElementById('pregamestart');
if (pregamestartbutton) {
    pregamestartbutton.addEventListener('click', function() {
        if (validateInput()) {``
            let input = document.getElementById('spelerTimeInput');
            localStorage.setItem('inputValue', input.value); //copilot line 
            window.location.href = 'game.html';
        }
    });
}

function updateTimer() {
    console.log('Updating timer', timerDisplay, time); 
    timerDisplay.textContent = time;
    if (time < 1) {
        endGame();
    } else {
        time--;
    }
}

window.onload = function() {
    if (window.location.href.indexOf('game.html') > -1) {
        time = parseInt(localStorage.getItem('inputValue'), 10);
        updateTimer();
    }
}

for (let i = 0; i < aantalGaatjes; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    hole.id = `hole${i}`;
    game.appendChild(hole);

    const mole = document.createElement('div');
    mole.classList.add('mole');
    hole.appendChild(mole); 

    mole.addEventListener('click', whack); 
}

function randomHole() {
    const gekozengaatje = Math.floor(Math.random() * aantalGaatjes);
    return document.getElementById(`hole${gekozengaatje}`);
}

function startGame() {
    if (gameStarted) {
        return;
    }
    gameStarted = true;
    backgroundmusic.play();
    result.style.visibility = 'hidden'; 
    clearInterval(timer);
    time = parseInt(localStorage.getItem('inputValue'), 10);
    
    updateTimer();
    timer = setInterval(updateTimer, 1000);
    clearInterval(berrySpawnInterval);

    berrySpawnInterval = setInterval(function() {
        const moles = document.querySelectorAll('.mole');
        moles.forEach(mole => {
            mole.style.visibility = 'hidden';
            mole.classList.remove('specialMole'); 
            mole.classList.remove('peek');
        });

        mole = moles[Math.floor(Math.random() * moles.length)];

        if (Math.random() < 0.1) { 
            mole.classList.add('specialMole');
        }
        mole.classList.add('peek');
        mole.style.visibility = 'visible';}, 600); // berryspawninterval
}

function endGame() {
    gameStarted = false;
    backgroundmusic.pause();
    backgroundmusic.currentTime = 0; //backgroundmusic opgezocht https://stackoverflow.com/questions/17636310/play-audio-and-restart-it-onclick
    clearInterval(berrySpawnInterval); 
    clearInterval(timer);
    timerDisplay.textContent = "Game Over!";
    gameoveraudio.play();

    const moles = document.querySelectorAll('.mole');
    moles.forEach(function(mole) {
        mole.style.visibility = 'hidden';
        mole.classList.remove('specialMole'); 
    });
	let result = document.getElementById('result'); 
	result.textContent = "Time is up!";
	result.style.visibility = 'visible';
}

function whack(e) {
    console.log('Hit!', e);
    score++; 
    berryslapaudio.play();
    if (e.target.classList.contains('specialMole')) {
        score += 2; 
        berryhitaudio.play();
    }

    scoreDisplay.textContent = `Score: ${score}`; 
    e.target.style.visibility = 'hidden'; 
}

startButton.addEventListener('click', function() {
    score = 0; 
    scoreDisplay.textContent = `Score: ${score}`; 
    startGame(); 
});

let result = document.getElementById('result'); 

//issue dat de tijd pas update als ik de game start 