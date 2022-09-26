// GAME PARAMETERS

function itemHasValue(key) {
    return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
}

let progress = itemHasValue("danceProgress") ? parseInt(localStorage.getItem("danceProgress")) : 0;
const debug = "on"//localStorage.getItem("debug");
let url = itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
url = "http://" + url + ":3000"

let stepsLeft = debug === "on" ? 4 : itemHasValue("stepCount") ? parseInt(localStorage.getItem("stepCount")) + 1 : 31;
let scoreGoal = debug === "on" ? 3 : itemHasValue("winScore") ? localStorage.getItem("winScore") : 3;
let badStepChance = itemHasValue("badStep") ? parseInt(localStorage.getItem("badStep")) / 100.0 : 0.45;
let snakeHideFreq = itemHasValue("spawnFreq") ? parseInt(localStorage.getItem("spawnFreq")) : 3;
let snakeShowDur = itemHasValue("timeOn") ? parseInt(localStorage.getItem("timeOn")) : 15;

document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") { // delete key
        alert("Resetting score...")
        progress = 0;
        localStorage.setItem("danceProgress", 0)
        updateScore(progress)
    }
});
// TODO Make this work automatically upon room reset

updateScore(progress)
$.ajax({
    type: 'POST',
    url: url + "/set-user",
    data: {"task": 0, "user": ""},
    dataType: 'json',
});

const winColor = "#4ed97f";
const loseColor = "#de5f5f";


let snakeTop, snakeLeft, snakeScale;
let winMessageStart;
var fullWidth = window.innerWidth - 500;
var fullHeight = window.innerHeight - 500;
let stepsHit = 0;
let stepHit = false;
let snakeHitTimer = 1000;
let snakeHitTimerMax = 1000;
let snakeHiddenTimer = 1000;
let scoreIncreased = false;

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

function updateScore(score) {
    $.ajax({
        type: 'POST',
        url: url + "/update",
        data: {"task": 0, "progress": score, "limit": scoreGoal},
        dataType: 'json',
    });
}

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);
    $('#view-2').animate({"left": "+=100vw"}, 300);
    submitUser();
    hideSnakes();
})

$('#good-step-container img').on('click tap', (e) => {
    stepHit = true;
    stepsHit++;
    if (stepsLeft < 0) {
        gameResult();
    }
})

$('#bad-step-container img').on('click tap', (e) => {
    stepHit = true;
    if (stepsHit !== 0)
        stepsHit--;
    if (stepsLeft < 0) {
        gameResult();
    }
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
        if (!scoreIncreased)
            progress++;
        scoreIncreased = true
        localStorage.setItem("danceProgress", progress)
        updateScore(progress)
        if (progress >= scoreGoal) {
            document.getElementById("restartButton").style.display = "none"
            winMessageStart = "You spend a good deal of the evening dancing with a young cavalry officer, Lieutenant Thomas Hearst, the second son of the Earl’s deceased sister. He has a bit of a reputation, having recently killed a man in a duel of honor and rumoured to be quite the rake.\n" +
                "\n" +
                "Nevertheless, the lieutenant’s debonair allure falls to your wily charms after these inebriating dances. Under your cautious prodding, he reveals that George Hearst, his elder brother, has had quite the falling out. Earlier this evening, Thomas overheard a heated argument involving the two of them over a woman.\n" +
                "\n" +
                "Who might that be? Could this discussion have something to do with the murder? The timing of the conflict seems, after all, suspicious. Or might it be the promise of yet another scandal threatening your friend Isobel? Was the late Earl involved in a romantic affair?\n" +
                "\n" +
                "Either way, your dancing efforts have left you parched and you make sure to grab a drink before pushing on in your investigation.";
        } else {
            document.getElementById("winButton").style.display = "none"
            winMessageStart = "Well done, that was quite the dance! Hope you're not too winded.";

        }
        $('.win-lose-start').text(winMessageStart);
        submitScore()
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text("You've kept up with the music as much as you could, but your dance partner was thoroughly unimpressed by your cotillon. Maybe the scotch reel will be more suited to your pace?")
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