// GAME PARAMETERS

const stepsNumberArray = [30, 50, 70];
const scoreGoalArray = [3000, 5000, 7000];

//Math.floor(Math.random() * stepsNumberArray.length)
let stepsLeft = stepsNumberArray[0]
$.ajax({
    type: 'POST',
    url: "http://127.0.0.1:5000/update",
    data: {"task": 0, "progress": 0, "limit": stepsLeft},
    dataType: 'json',
});
let scoreGoal = scoreGoalArray[0];

const winColor = "#4ed97f";
const loseColor = "#de5f5f";

const winMessageStartArray = ["You did it!", "Great!", "Nice job!", "Good work!"];
const loseMessageStartArray = ["Oh no!", "Not this time!", "Better luck next time!", "Nice try!"];

let snakeTop, snakeLeft, snakeScale;
let winMessageStart;
var fullWidth = window.innerWidth - 500;
var fullHeight = window.innerHeight - 500;
let stepsHit = 0;
let stepHit = false;
let snakeHitTimer = 1000;
let snakeHitTimerMax = 1000;
let snakeHiddenTimer = 1000;

// VIEW 1 CONTENT

$('#snake-num').text(stepsLeft);
$('#score-goal').text(scoreGoal);

// VIEW 2 CONTENT

$('#steps-left').text(stepsLeft);
$('#snake-goal').text(stepsLeft);
$('#steps-hit').text(stepsHit);

function updateScore() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/update",
        data: {"task": 0, "progress": stepsHit},
        dataType: 'json',
    });
}

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);
    $('#view-2').animate({"left": "+=100vw"}, 300);
    hideSnakes();
    // updateScore();
})

$('#good-step-container img').on('click tap', (e) => {
    stepHit = true;
    stepsHit++;
    $('#steps-hit').text(stepsHit);
    if (stepsLeft < 1) {
        gameResult();
    }
    // updateScore();
})

$('#bad-step-container img').on('click tap', (e) => {
    stepHit = true;
    if (stepsLeft < 1) {
        gameResult();
    }
    // updateScore();
})

let hideSnakes = () => {
    stepsLeft--;
    $('#steps-left').text(stepsLeft);
    document.getElementById("bad-step-container").style.visibility = "hidden";
    document.getElementById("good-step-container").style.visibility = "hidden";
    snakeHiddenTimer = Math.floor(Math.random() * 3 + 1);
    // console.log(snakeHiddenTimer);
    const snakeHideTimer = setInterval(() => {
        snakeHiddenTimer--;
        if (snakeHiddenTimer <= 0) {
            clearInterval(snakeHideTimer);
            moveSnake();
        }
    }, 250);
}

let moveSnake = () => {
    snakeTop = Math.floor(Math.random() * fullHeight);
    snakeLeft = Math.floor(Math.random() * fullWidth);
    // console.log(snakeLeft,snakeTop)
    snakeScale = Math.floor(Math.random() * 10 + 10);
    $('.step-container img').css({
        'top': `${snakeTop}px`,
        'left': `${snakeLeft}px`,
        'width': `${snakeScale}vw`,
        'opacity': '1'
    })
    if (Math.random() > 0.45) {
        document.getElementById("good-step-container").style.visibility = "visible";
        document.getElementById("bad-step-container").style.visibility = "hidden";
    } else {
        document.getElementById("good-step-container").style.visibility = "visible";
        document.getElementById("bad-step-container").style.visibility = "visible";
        snakeTop = Math.floor(Math.random() * fullHeight);
        snakeLeft = Math.floor(Math.random() * fullWidth);
        // console.log(snakeLeft,snakeTop)
        snakeScale = Math.floor(Math.random() * 10 + 10);
        $('#bad-step-container img').css({
            'top': `${snakeTop}px`,
            'left': `${snakeLeft}px`,
            'width': `${snakeScale}vw`,
            'opacity': '1'
        })
    }
    stepHit = false
    snakeHitTimerMax = Math.floor(Math.random() * 15 + 2);
    snakeHitTimer = snakeHitTimerMax;
    const snakeTimer = setInterval(() => {
        snakeHitTimer--;
        if (stepHit || snakeHitTimer <= 0) {
            clearInterval(snakeTimer);
            hideSnakes();
        } else {
            $('.step-container img').css({
                'opacity': `${(snakeHitTimer / snakeHitTimerMax) + 0.1}`
            })
        }
    }, 250);
}

// VIEW 3 CONTENT

let gameResult = () => {
    $('#good-step-container img').remove();
    if (stepsLeft < 1) {
        $('#win-lose-messages').css('background', winColor);
        winMessageStart = winMessageStartArray[Math.floor(Math.random() * winMessageStartArray.length)];
        $('.win-lose-start').text(winMessageStart);
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)])
    }
    $('#view-3').fadeIn();
}

