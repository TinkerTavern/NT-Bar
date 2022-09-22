// GAME PARAMETERS

// Game ID = 1

// TODO: Nice to have - Spectator players vote on answers
// This might require another flask app for people to connect to via phone to answer..

function itemHasValue(key) {
    return localStorage.getItem(key) !== "" && localStorage.getItem(key) != null
}
function countNums(val) {
    return localStorage.getItem("orderToSolve").split(",").length
}

let url = itemHasValue("addr") ? localStorage.getItem("addr") : "127.0.0.1"
url = "http://" + url + ":3000"

let multipleChoice = localStorage.getItem("multiChoice");
let timerLength = itemHasValue("timeToSolve") ? localStorage.getItem("timeToSolve") : 60;
let riddlesToSolve = itemHasValue("orderToSolve") ? countNums("orderToSolve") : 3;
let riddlesToWin = itemHasValue("noToSolve") ? localStorage.getItem("noToSolve") : 3;
let multiChoiceAnswerCount = itemHasValue("multipleChoiceChoices") ? localStorage.getItem("multipleChoiceChoices") : 3;

let won = 0;
let win, riddle, riddleId, answer, gameTimer;
const winColor = "#4ed97f";
const loseColor = "#de5f5f";


const winMessageStartArray = ["You did it!", "Great!", "Nice job!", "Good work!"];
const loseMessageStartArray = ["Oh no!", "Not this time!", "Better luck next time!", "Nice try!"];
const winWinMessageStartArray = ["You've solved my riddle, I'll reveal my secret..", "You're smart! I'll let you in on a secret...",
    "That was fun, let me tell you something you don't know...", "Nice! We should do that again some time. For now..."];
const loseLoseMessageStartArray = ["Tricked you, try again!", "I'm not telling you anything unless you solve my riddles, try again!",
    "Better luck next time, try again!", "Riddles can be confusing, try again!"];

// SELECT AND DISPLAY RIDDLE
$.ajax({
    type: 'POST',
    url: url + "/update",
    data: {"task": 1, "progress": won, "limit": riddlesToWin},
    dataType: 'json',
});
$.ajax({
    type: 'POST',
    url: url + "/set-user",
    data: {"task": 1, "user": ""},
    dataType: 'json',
});

document.getElementById("userName").value = localStorage.getItem("userName1")

function submitUser() {
    localStorage.setItem("userName1", document.getElementById("userName").value);
    $.ajax({
        type: 'POST',
        url: url + "/set-user",
        data: {"task": 1, "user": document.getElementById("userName").value},
        dataType: 'json',
    });
}

var input = document.getElementById("answer");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submitButton").click();
    }
});

const setRiddle = () => {
    // Get local storage value for id
    if (typeof (Storage) !== "undefined") {
        riddleId = localStorage.getItem("riddle-id");
        if (riddleId === null) {
            riddleId = 1;
        } else {
            riddleId = parseInt(riddleId);
        }
    } else {
        riddleId = Math.floor(Math.random * 8 + 1);
    }
    fetchRiddle(riddleId).then((riddle) => {
        $('.riddle').text(riddle.question);
        if (multipleChoice === "on")
            populateAnswers(riddle.answers);
        answer = riddle.answers[0].toLowerCase();
        if (riddleId === 9) {
            riddleId = 1;
        } else {
            riddleId++;
        }
        localStorage.setItem("riddle-id", riddleId);
    });
}


function answer1() {
    let ans = document.getElementById("answer1").value.toLowerCase();
    submitAnswer(ans)
}

function answer2() {
    let ans = document.getElementById("answer2").value.toLowerCase();
    submitAnswer(ans)
}

function answer3() {
    let ans = document.getElementById("answer3").value.toLowerCase();
    submitAnswer(ans)
}

function answer4() {
    let ans = document.getElementById("answer4").value.toLowerCase();
    submitAnswer(ans)
}

function answerWritten() {
    let ans = document.getElementById("answer").value.toLowerCase();
    submitAnswer(ans)
}

function populateAnswers(answers) {
    let a = ["answer1", "answer2", "answer3", "answer4"];
    let zero = false
    let index = -1
    let nums = [-1, -1, -1]
    while (!zero) {
        for (var i = 0; i < a.length; i++) {
            if (i > multiChoiceAnswerCount - 1)
                document.getElementById(a[i]).style.display = "none";
            else {
                index = Math.floor(Math.random() * answers.length)
                while (nums.includes(index)) {
                    index = Math.floor(Math.random() * answers.length)
                }
                if (index === 0)
                    zero = true
                nums[i] = index
                document.getElementById(a[i]).value = answers[index];
            }
        }
    }
}


function submitAnswer(ans) {
    if (ans.length < 3)
        return;
    else win = !!ans.includes(answer);
    gameResult();

}

const fetchRiddle = async riddleId => {
    let response = await fetch('static/javaScript/riddles.json');
    let data = await response.json();
    riddle = data.riddles.find(item => item.id === riddleId);
    return riddle;
}

setRiddle();

if (multipleChoice === "on") {
    var x = document.getElementById("textEntry");
} else {
    var x = document.getElementById("multiChoice");
}
x.style.display = "none";

// VIEW 1 CONTENT

$('#riddleCount').text(riddlesToWin);
// VIEW 2 CONTENT

$('#time-left').text(timerLength);

$('#timer-length').text(timerLength);

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);
    submitUser();
    if (timerLength !== -1)
        startTimer();
})

function startTimer() {
    gameTimer = setInterval(() => {
        timerLength--;
        $('#time-left').text(timerLength);
        if (timerLength === 0 && !win) {
            finalScreen();
        }
    }, 1000);
}

$('#right').on('click tap', (e) => {
    win = true;
    gameResult();
});

$('#wrong').on('click tap', (e) => {
    win = false;
    gameResult();
});

// VIEW 3 CONTENT
function submitResult() {
    $.ajax({
        type: 'POST',
        url: url + "/update",
        data: {"task": 1, "progress": won},
        dataType: 'json',
    });
}

function finalScreen() {
    clearInterval(gameTimer);
    if (win)
        won++;
    $('#view-2').animate({'opacity': 0.2}, 300);

    if (won == riddlesToWin) {
        $('.win-lose-messages').css('background', winColor);
        $('.win-lose-start').text(winWinMessageStartArray[Math.floor(Math.random() * winWinMessageStartArray.length)]);
        document.getElementById("restartButton").style.display = "none"
        submitScore();
    } else {
        $('.win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseLoseMessageStartArray[Math.floor(Math.random() * loseLoseMessageStartArray.length)] + " Score: " + won + "/" + riddlesToWin)
        document.getElementById("winButton").style.display = "none"

    }
    submitResult();
    $('#view-4').fadeIn();

}

function submitScore() {
    $.ajax({
        type: 'POST',
        url: url + "/submit",
        data: {"task": 1, "user": document.getElementById("userName").value, "time": timerLength},
        dataType: 'json',
    });
}

function winGame() {
    console.log("wooo")
}

let gameResult = () => {
    riddlesToSolve--;

    if (riddlesToSolve <= 0) {
        finalScreen();
        return;
    }
    $('#view-2').animate({'opacity': 0.2}, 300);
    if (win) {
        won++;
        $('#win-lose-messages').css('background', winColor);
        $('.win-lose-start').text(winMessageStartArray[Math.floor(Math.random() * winMessageStartArray.length)]);
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)])
    }
    submitResult();
    $('#view-3').fadeIn();

}

function cont() {
    $('#view-3').fadeOut();
    document.getElementById("answer").value = ""
    $('#view-2').animate({'opacity': 1}, 300);
    setRiddle();
}
