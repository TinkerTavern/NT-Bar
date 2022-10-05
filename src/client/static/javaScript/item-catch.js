// GAME PARAMETERS

function itemHasValue(key) {
    return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
}

let progress = itemHasValue("danceProgress") ? parseInt(localStorage.getItem("danceProgress")) : 0;
const debug = localStorage.getItem("debug");
let url = itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
url = "http://" + url + ":3000"

let stepsLeft = debug === "on" ? 4 : itemHasValue("stepCount") ? parseInt(localStorage.getItem("stepCount")) + 1 : 300;
let scoreGoal = debug === "on" ? 3 : itemHasValue("winScore") ? localStorage.getItem("winScore") : 30;
let snakeHideFreq = itemHasValue("spawnFreq") ? parseInt(localStorage.getItem("spawnFreq")) : 4;
let snakeShowDur = itemHasValue("timeOn") ? parseInt(localStorage.getItem("timeOn")) : 10;
let timerLength = itemHasValue("danceTimer") ? localStorage.getItem("danceTimer") : 100;
let gamesToWin = itemHasValue("gamesToWin") ? localStorage.getItem("gamesToWin") : 3;
let snakeTop, snakeLeft, snakeScale;
let winMessageStart;
let stepsHit = 0;
let goodStepHit = false;
let badStepHit = false;
let badSnakeHitTimer;
let goodSnakeHitTimer;

let scoreIncreased = false;

document.getElementById("view-2").style.visibility = "hidden"
updateScore(progress)
if (localStorage.getItem("hideLeaderboard") !== "on")
    loadLeaderboard()
if (localStorage.getItem("hideProgress") !== "on")
    loadImage()
if (localStorage.getItem("showTimer") === "on")
    document.getElementById("timerr").style.visibility = 'visible'
if (localStorage.getItem("showTarget") === "on")
    document.getElementById("stepper").style.visibility = 'visible'
if (localStorage.getItem("showStepsLeft") === "on")
    document.getElementById("snake-count").style.visibility = 'visible'
if (localStorage.getItem("showTutorial") === "on")
    $('.tutorial').css({
        'visibility': 'visible',
    })


submitUser(true)

function submitScore() {
    $.ajax({
        type: 'POST',
        url: url + "/submit",
        data: {"task": 0, "user": document.getElementById("userName").value, "time": stepsHit},
        dataType: 'json',
    });
}

function submitUser(blankUser) {
    localStorage.setItem("userName0", document.getElementById("userName").value);
    $.ajax({
        type: 'POST',
        url: url + "/set-user",
        data: {"task": 0, "user": blankUser ? "" : document.getElementById("userName").value},
        dataType: 'json',
        success: function (data) {
            if (data["reset"] === true)
                confirmReset()
        }
    });
}

function loadLeaderboard() {
    document.getElementById("danceScores").style.visibility = "visible"
    game = "danceScores"
    $.ajax({
        type: 'POST',
        url: url + "/get-leaderboard",
        data: {"task": 0},
        dataType: 'json',
        success: function (data) {
            let unit = game.replace("Scores", "") === "dance" ? "Points" : game.replace("Scores", "") === "puzzle" ? "Time taken (s)" : "Time left (s)"
            document.getElementById(game).innerHTML = "High scores!<br>" +
                "<table class='leaderboard'><tr><th>Name</th><th>" + unit + "</th></tr><tr><td>" +
                data["board"].replaceAll("\n", "</td></tr><tr><td>").replaceAll(",", "</td><td>") + "</table>"
        }
    });
}

function loadImage() {
    document.getElementById("progress").style.visibility = "visible"
    let images = ["catch1", "catch2", "catch3"]
    for (let j = 0; j < images.length; j++) {
        if (j >= Math.floor(((progress / 3) / 0.333333))) {
            document.getElementById(images[j]).style.filter = "blur(35px)";
        } else {
            document.getElementById(images[j]).style.filter = "none";
        }
    }
}

function confirmReset() {
    alert("Resetting score, make sure to refresh all clients...")
    progress = 0;
    localStorage.setItem("danceProgress", 0)
    updateScore(progress)
    $.ajax({
        type: 'POST',
        url: url + "/confirm-reset",
        data: {
            "task": 0,
            dataType: 'json',
        }
    });
}

// VIEW 1 CONTENT

$('#snake-num').text(stepsLeft);

$('#score-goal').text(scoreGoal);
// VIEW 2 CONTENT
$('#steps-left').text(stepsLeft);
$('#snake-goal').text(scoreGoal);
$('#time-left').text(timerLength);
$('#steps-hit').text(stepsHit);

document.getElementById("userName").value = localStorage.getItem("userName0")

function updateScore(score) {
    $.ajax({
        type: 'POST',
        url: url + "/update",
        data: {"task": 0, "progress": score, "limit": gamesToWin},
        dataType: 'json',
    });
}

$('.play').on('click tap', (e) => {
    if (document.getElementById("userName").value !== "") {
        $('#view-1').animate({"left": "-=100vw"}, 300);
        document.getElementById("view-2").style.visibility = "visible"
        $('#view-2').animate({"left": "+=100vw"}, 300);
        submitUser(false);
        hideSnakes();
        startTimer()
    }
    else
        alert("Enter your name please!")
})

function startTimer() {
    gameTimer = setInterval(() => {
        timerLength--;
        $('#time-left').text(timerLength);
        if (timerLength === 0) {
            gameResult();
        }
    }, 1000);
}


$('#good-step-container img').on('click tap', (e) => {
    document.getElementById("good-step-container").style.display = 'none'
    goodStepHit = true;
    stepsHit++;
    if (stepsLeft < 0) {
        gameResult();
    }
})

$('#bad-step-container img').on('click tap', (e) => {
    document.getElementById("bad-step-container").style.display = 'none'
    badStepHit = true;
    if (stepsHit !== 0)
        stepsHit--;
    if (stepsLeft < 0) {
        gameResult();
    }
})

let hideSnake = (id) => {
    stepsLeft--;
    $('#steps-left').text(stepsLeft);
    $('#steps-hit').text(stepsHit);
    if (stepsLeft <= 0) {
        gameResult();
        return;
    }
    document.getElementById(id).style.opacity = "0";
    let goodStepHiddenTimer;
    let badStepHiddenTimer;
    if (id === "bad-step-container") {
        badStepHiddenTimer = Math.floor(Math.random() * snakeHideFreq + 2);
        const badStepHideTimer = setInterval(() => {
            badStepHiddenTimer--;
            if (badStepHiddenTimer <= 0) {
                clearInterval(badStepHideTimer);
                moveSnake("bad-step-container");
            }
        }, 250);
    } else {
        goodStepHiddenTimer = Math.floor(Math.random() * snakeHideFreq + 1);
        const goodStepHideTimer = setInterval(() => {
            goodStepHiddenTimer--;
            if (goodStepHiddenTimer <= 0) {
                clearInterval(goodStepHideTimer);
                moveSnake("good-step-container");
            }
        }, 250);
    }


}

let hideSnakes = () => {
    stepsLeft--;
    $('#steps-left').text(stepsLeft);
    $('#steps-hit').text(stepsHit);
    if (stepsLeft <= 0) {
        gameResult();
        return;
    }
    hideSnake("good-step-container")
    hideSnake("bad-step-container")
}
// 15-80% vertically
// 0-85% horizontally

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elementsOverlap(el1, el2) {
    const domRect1 = document.getElementById(el1).getBoundingClientRect();
    const domRect2 = document.getElementById(el2).getBoundingClientRect();
    return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
    );
}

function randMove(id) {
    let angle = "0";
    if (id === "bad-step-container" && localStorage.getItem("inverseBad") === "on")
        angle = "180";
    else if (localStorage.getItem("randomRotation") === "on")
        angle = getRandomInt(0,360).toString()

    snakeTop = getRandomArbitrary(15, 75)
    snakeLeft = getRandomArbitrary(0, 86)
    $('#' + id + ' img').css({
        'top': `${snakeTop}%`,
        'left': `${snakeLeft}%`,
        'width': `350px`,
        'z-index': '1',
        'rotate': angle+"deg",
    })
}


let moveSnake = (id) => {
    randMove(id)
    // while (elementsOverlap("good-step-image1", "bad-step-image1")) {
    //     console.log("ppsh")
    //     randMove(id)
    // }
    // TODO Fix

    document.getElementById(id).style.opacity = "1";
    document.getElementById(id).style.display = "block";

    if (id === "good-step-container")
        var ids = ["good-step-image1", "good-step-image2", "good-step-image3", "good-step-image4", "good-step-image5"]
    else
        var ids = ["bad-step-image1", "bad-step-image2", "bad-step-image3", "bad-step-image4", "bad-step-image5"]
    var footID = getRandomInt(1, 5)
    for (var i = 0; i < 5; i++) {
        if (i === footID)
            document.getElementById(ids[i]).style.visibility = "visible";
        else
            document.getElementById(ids[i]).style.visibility = "hidden";
    }
    let goodSnakeHitTimerMax;
    let badSnakeHitTimerMax;
    if (id === "good-step-container") {
        goodStepHit = false
        goodSnakeHitTimerMax = Math.floor(Math.random() * snakeShowDur + 3);
        goodSnakeHitTimer = goodSnakeHitTimerMax;
        const goodSnakeTimer = setInterval(() => {
            goodSnakeHitTimer--;
            if (goodStepHit || goodSnakeHitTimer <= 0) {
                clearInterval(goodSnakeTimer);
                hideSnake(id);
            } else if (localStorage.getItem("fadeOut") !== "on") {
                document.getElementById(id).style.opacity = ((goodSnakeHitTimer / goodSnakeHitTimerMax)).toString()
            }
        }, 250);
    } else {
        badStepHit = false
        badSnakeHitTimerMax = Math.floor(Math.random() * snakeShowDur + 2);
        badSnakeHitTimer = badSnakeHitTimerMax;
        const badSnakeTimer = setInterval(() => {
            badSnakeHitTimer--;
            if (badStepHit || badSnakeHitTimer <= 0) {
                clearInterval(badSnakeTimer);
                hideSnake(id);
            } else if (localStorage.getItem("fadeOut") !== "on") {
                $('#' + id + ' img').css({
                    'opacity': `${(badSnakeHitTimer / badSnakeHitTimerMax) + 0.1}`
                })
            }
        }, 250);
    }

}

// VIEW 3 CONTENT

let gameResult = () => {
    $('.step-container img').remove();
    $('.background-image').remove();
    $('#view-2').remove();
    if (stepsHit >= scoreGoal) {
        if (!scoreIncreased)
            progress++;
        scoreIncreased = true
        localStorage.setItem("danceProgress", progress)
        updateScore(progress)
        if (progress >= gamesToWin) {
            document.getElementById("restartButton").style.display = "none"
            document.getElementById("win-lose-start").innerHTML = "You spend a good deal of the evening dancing with a young cavalry officer, Lieutenant Thomas Hearst, the second son of the Earl’s deceased sister. He has a bit of a reputation, having recently killed a man in a duel of honor and rumoured to be quite the rake.\n" +
                "\n" +
                "Nevertheless, the lieutenant’s debonair allure falls to your wily charms after these inebriating dances. Under your cautious prodding, he reveals that George Hearst, his elder brother, has had quite the falling out. Earlier this evening, Thomas overheard a heated argument involving the two of them over <b>a woman</b>.\n" +
                "\n" +
                "Who might that be? Could this discussion have something to do with the murder? The timing of the conflict seems, after all, suspicious. Or might it be the promise of yet another scandal threatening your friend Isobel? Was the late Earl involved in a romantic affair?\n" +
                "\n" +
                "Either way, your dancing efforts have left you parched and you make sure to grab a drink before pushing on in your investigation.\n";
        } else {
            document.getElementById("winButton").style.display = "none"
            winMessageStart = "Well done, that was quite the dance! Hope you're not too winded.";

            $('.win-lose-start').text(winMessageStart);
        }
        $('.win-title').text("Win")
        submitScore()
    } else {
        $('.win-title').text("Lose")
        $('.win-lose-start').text("You've kept up with the music as much as you could, but your dance partner was thoroughly unimpressed by your cotillon. Maybe the scotch reel will be more suited to your pace?")
        document.getElementById("winButton").style.display = "none"

    }
    $('#view-3').fadeIn();
}

function winGame() {
    console.log("wooo")
}