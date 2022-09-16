// GAME PARAMETERS

const stepsNumberArray = [31, 51, 71];
const scoreGoalArray = [15, 25, 35];
const debug = false;

//Math.floor(Math.random() * stepsNumberArray.length)
let index = Math.floor(Math.random() * stepsNumberArray.length);
let stepsLeft = debug ? 2 : stepsNumberArray[index]
let scoreGoal = debug ? 1 : scoreGoalArray[index];
console.log(index)
console.log(scoreGoal)
$.ajax({
    type: 'POST',
    url: "http://127.0.0.1:3000/update",
    data: {"task": 0, "progress": 0, "limit": scoreGoal},
    dataType: 'json',
});

const winColor = "#4ed97f";
const loseColor = "#de5f5f";

const winMessageStartArray = ["You've mastered the dance, I'll reveal my secret..", "Nice moves! I'll let you in on a secret...",
    "That was fun, let me tell you something you don't know...", "Nice! We should do that again some time. For now..."];
const loseMessageStartArray = ["Do you have two left feet? Try again!", "I'm not telling you anything with moves like that, try again!",
    "Better luck next time, try again!", "Dancing can be hard, let's try again!"];

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
$('#snake-goal').text(scoreGoal);
$('#steps-hit').text(stepsHit);

function updateScore() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3000/update",
        data: {"task": 0, "progress": stepsHit},
        dataType: 'json',
    });
}

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);
    $('#view-2').animate({"left": "+=100vw"}, 300);
    hideSnakes();
    updateScore();
})

$('#good-step-container img').on('click tap', (e) => {
    stepHit = true;
    stepsHit++;
    if (stepsLeft < 1) {
        gameResult();
    }
    updateScore();
})

$('#bad-step-container img').on('click tap', (e) => {
    stepHit = true;
    if (stepsHit !== 0)
        stepsHit--;
    if (stepsLeft < 1) {
        gameResult();
    }
    updateScore();
})

let hideSnakes = () => {
    stepsLeft--;
    $('#steps-left').text(stepsLeft);
    $('#steps-hit').text(stepsHit);
    if (stepsLeft <= 0) {
        gameResult();
        return;
    }
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
    $('.step-container img').remove();
    $('.background-image').remove();
    if (stepsHit >= scoreGoal) {
        $('#win-lose-messages').css('background', winColor);
        winMessageStart = winMessageStartArray[Math.floor(Math.random() * winMessageStartArray.length)];
        $('.win-lose-start').text(winMessageStart);
        document.getElementById("restartButton").style.visibility = "hidden"
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)] +
            " Score: " + stepsHit + "/" + scoreGoal)
        document.getElementById("winButton").style.visibility = "hidden"

    }
    $('#view-3').fadeIn();
}

function winGame() {
    console.log("wooo")
}