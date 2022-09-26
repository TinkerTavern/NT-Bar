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
let progress = itemHasValue("charadesProgress") ? parseInt(localStorage.getItem("charadesProgress")) : 0;
let multipleChoice = localStorage.getItem("multiChoice");
let timerLength = itemHasValue("timeToSolve") ? localStorage.getItem("timeToSolve") : 60;
let riddleOrder = itemHasValue("orderToSolve") ? countNums("orderToSolve") : [0, 7, 5, 6, 8, 2, 1, 4, 3];
let riddlesToWin = itemHasValue("noToSolve") ? localStorage.getItem("noToSolve") : 3;
let multiChoiceAnswerCount = itemHasValue("multipleChoiceChoices") ? localStorage.getItem("multipleChoiceChoices") : 3;

let win, riddle, riddleId, answer, gameTimer;
const winColor = "#4ed97f";
const loseColor = "#de5f5f";


// SELECT AND DISPLAY RIDDLE
updateScore(progress)
submitUserName("")

document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") { // delete key
        alert("Resetting score...")
        progress = 0;
        localStorage.setItem("charadesProgress", 0)
        updateScore(progress)
    }
});

// TODO Make this work automatically upon room reset


function updateScore(score) {
    $.ajax({
        type: 'POST',
        url: url + "/update",
        data: {"task": 1, "progress": score, "limit": riddlesToWin},
        dataType: 'json',
    });
}

document.getElementById("userName").value = localStorage.getItem("userName1")

function submitUser() {
    localStorage.setItem("userName1", document.getElementById("userName").value);
    submitUserName(document.getElementById("userName").value)
}

function submitUserName(name) {
    $.ajax({
        type: 'POST',
        url: url + "/set-user",
        data: {"task": 1, "user": name},
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
    riddleId = riddleOrder[progress] + 1
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
    finalScreen();

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
    finalScreen();
});

$('#wrong').on('click tap', (e) => {
    win = false;
    finalScreen();
});

// VIEW 3 CONTENT


function finalScreen() {
    clearInterval(gameTimer);
    submitUserName("")
    if (win) {
        progress++;
        localStorage.setItem("charadesProgress", progress)
        submitScore()
        updateScore(progress)
    }
    $('#view-2').animate({'opacity': 0.2}, 300);

    if (progress >= riddlesToWin) {
        $('.win-lose-messages').css('background', winColor);
        $('.win-lose-start').text("Miss Fanny Delahoussaye is quite impressed by your skills. With a conspiratorial air, she leans and whispers at your ear:\n" +
            "\n" +
            "“My second is not polite of my first,\n" +
            "Yet it provides a most welcome release:\n" +
            "My whole often finds my first at their worst,\n" +
            "And will yearly clear my second of grease.\n" +
            "The Earl’s misfortune, it seems quite clear,\n" +
            "Could only be caused by my whole, my dear.”\n" +
            "\n" +
            "She winks before you can ask what she means and how on Earth has she heard of the Earl’s demise. After a brief moment of pondering, you realise Fanny is absolutely right (as she often is). Of course! Only a servant could have had the access required to poison the Earl’s drink in his study.\n" +
            "\n" +
            "With this new clue and charade added to your collection, you carry onwards in your investigation.");
        document.getElementById("restartButton").style.display = "none"
        submitScore();
    } else if (win) {
        $('#win-lose-messages').css('background', winColor);
        $('.win-lose-start').text("You truly kept your wits about you. Excellent wordplay, well done!");
        document.getElementById("winButton").style.display = "none"

    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text("Looks like you left your wit at home. No fret, happens to the best of us. Why don't you go fetch it and try again.")
        document.getElementById("winButton").style.display = "none"
    }
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


}

function cont() {
    $('#view-3').fadeOut();
    document.getElementById("answer").value = ""
    $('#view-2').animate({'opacity': 1}, 300);
    setRiddle();
}
