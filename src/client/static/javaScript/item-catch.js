// GAME PARAMETERS

function itemHasValue(key) {
    return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
}

const debug = localStorage.getItem("debug");
let url = itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
url = "http://" + url + ":3000"

let stepsLeft = debug === "on" ? 4 : itemHasValue("stepCount") ? parseInt(localStorage.getItem("stepCount")) + 1 : 31;
let scoreGoal = debug === "on" ? 3 : itemHasValue("winScore") ? localStorage.getItem("winScore") : 15;
let badStepChance = itemHasValue("badStep") ? parseInt(localStorage.getItem("badStep")) / 100.0 : 0.45;
let snakeHideFreq = itemHasValue("spawnFreq") ? parseInt(localStorage.getItem("spawnFreq")) : 3;
let snakeShowDur = itemHasValue("timeOn") ? parseInt(localStorage.getItem("timeOn")) : 15;


console.log(badStepChance)

$.ajax({
    type: 'POST',
    url: url + "/update",
    data: {"task": 0, "progress": 0, "limit": scoreGoal},
    dataType: 'json',
});
$.ajax({
    type: 'POST',
    url: url + "/set-user",
    data: {"task": 0, "user": ""},
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
document.getElementById("userName").value = localStorage.getItem("userName0")

function submitUser() {
    localStorage.setItem("userName0", document.getElementById("userName").value);
    $.ajax({
        type: 'POST',
        url: url + "/set-user",
        data: {"task": 0, "user": document.getElementById("userName").value},
        dataType: 'json',
    });
}

function updateScore() {
    $.ajax({
        type: 'POST',
        url: url + "/update",
        data: {"task": 0, "progress": stepsHit},
        dataType: 'json',
    });
}

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);
    $('#view-2').animate({"left": "+=100vw"}, 300);
    submitUser();
    hideSnakes();
    updateScore();
})

$('#good-step-container img').on('click tap', (e) => {
    stepHit = true;
    stepsHit++;
    if (stepsLeft < 0) {
        gameResult();
    }
    updateScore();
})

$('#bad-step-container img').on('click tap', (e) => {
    stepHit = true;
    if (stepsHit !== 0)
        stepsHit--;
    if (stepsLeft < 0) {
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
    snakeHiddenTimer = Math.floor(Math.random() * snakeHideFreq + 1);
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
    if (Math.random() > badStepChance) {
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
    snakeHitTimerMax = Math.floor(Math.random() * snakeShowDur + 3);
    snakeHitTimer = snakeHitTimerMax;
    const snakeTimer = setInterval(() => {
        snakeHitTimer--;
        if (stepHit || snakeHitTimer <= 0) {
            clearInterval(snakeTimer);
            hideSnakes();
        } else if (localStorage.getItem("fadeOut") !== "on") {
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
        document.getElementById("restartButton").style.display = "none"
        submitScore()
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)] +
            " Score: " + stepsHit + "/" + scoreGoal)
        document.getElementById("winButton").style.display = "none"

    }
    $('#view-3').fadeIn();
}
function submitScore() {
    $.ajax({
        type: 'POST',
        url: url + "/submit",
        data: {"task": 0, "user": document.getElementById("userName").value, "time": stepsHit},
        dataType: 'json',
    });
}

function winGame() {
    console.log("wooo")
}