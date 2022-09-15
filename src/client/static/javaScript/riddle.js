// GAME PARAMETERS


let timerLength = 300;
let multipleChoice = true;

let win, riddle, riddleId, answer, gameTimer;
const winColor = "#4ed97f";
const loseColor = "#de5f5f";

const winMessageStartArray = ["You did it!", "Great!", "Nice job!", "Good work!"];
const loseMessageStartArray = ["Oh no!", "Not this time!", "Better luck next time!", "Nice try!"];

let winMessageStart, loseMessageStart;

// SELECT AND DISPLAY RIDDLE


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
        riddleId = localStorage.getItem("tile-shift-id");
        if (riddleId === null) {
            riddleId = 1;
        } else {
            riddleId = parseInt(riddleId);
        }
    } else {
        riddleId = Math.floor(Math.random * 9 + 1);
    }
    fetchRiddle(riddleId).then((riddle) => {
        $('.riddle').text(riddle.question);
        console.log(riddle.question)
        if (multipleChoice)
            populateAnswers(riddle.answers);
        answer = riddle.answers[0].toLowerCase();
        if (riddleId === 10) {
            riddleId = 1;
        } else {
            riddleId++;
        }
        localStorage.setItem("tile-shift-id", riddleId);
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

function answerWritten() {
    let ans = document.getElementById("answer").value.toLowerCase();
    submitAnswer(ans)
}

function populateAnswers(answers) {
    let a = ["answer1", "answer2", "answer3"];
    let zero = false
    let index = -1
    let nums = [-1, -1, -1]
    while (!zero) {
        for (var i = 0; i < a.length; i++) {
            index = Math.floor(Math.random() * answers.length)
            while (nums.includes(index)) {
                console.log("woah")
                index = Math.floor(Math.random() * answers.length)
            }
            if (index === 0)
                zero = true
            // console.log(index)
            nums[i] = index
            document.getElementById(a[i]).value = answers[index];
        }
    }
}


function submitAnswer(ans) {
    if (ans.length < 3)
        return;
    if (ans.includes(answer))
        win = true;
    gameResult();

}

const fetchRiddle = async riddleId => {
    let response = await fetch('static/javaScript/riddles.json');
    let data = await response.json();
    riddle = data.riddles.find(item => item.id === riddleId);
    return riddle;
}

setRiddle();

if (multipleChoice) {
    var x = document.getElementById("textEntry");
} else {
    var x = document.getElementById("multiChoice");
}
x.style.display = "none";

// VIEW 1 CONTENT

$('#timer-length').text(timerLength);

// VIEW 2 CONTENT

$('#time-left').text(timerLength);

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);

    gameTimer = setInterval(() => {
        timerLength--;
        $('#time-left').text(timerLength);
        if (timerLength === 0 && !win) {
            gameResult();
        }
    }, 1000);
})

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
        url: "http://127.0.0.1:5000/update",
        data: {"task": 2, "progress": win ? 1 : 0},
        dataType: 'json',
    });
}

let gameResult = () => {
    submitResult();
    clearInterval(gameTimer);
    $('#view-2').css('background', 'white');
    $('#view-2').animate({'opacity': 0.2}, 300);
    $('#good-step-container img').remove();
    if (win) {
        $('#win-lose-messages').css('background', winColor);
        winMessageStart = winMessageStartArray[Math.floor(Math.random() * winMessageStartArray.length)];
        $('.win-lose-start').text(winMessageStart);
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)])
    }
    $('#view-3').fadeIn();
}

function restart() {
    document.location.reload();
}
