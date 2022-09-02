// GAME PARAMETERS


let timerLength = 30;

let win, riddle, riddleId, answer, gameTimer;
const winColor = "#4ed97f"; 
const loseColor = "#de5f5f";

const winMessageStartArray = ["You did it!", "Great!", "Nice job!", "Good work!"];
const loseMessageStartArray = ["Oh no!", "Not this time!", "Better luck next time!", "Nice try!"];

let winMessageStart, loseMessageStart;

// SELECT AND DISPLAY RIDDLE
var input = document.getElementById("answer");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submitButton").click();
    }
});

const setRiddle = () => {
    // Get local storage value for id
    if (typeof(Storage) !== "undefined") {
        riddleId = localStorage.getItem("riddle-id");
        if (riddleId === null){
            riddleId = 1;
        } else {
            riddleId = parseInt(riddleId);
        }
    } else {
        riddleId = Math.floor(Math.random * 9 + 1);
    }   
    fetchRiddle(riddleId).then((riddle) => {
        $('.riddle').text(riddle.question);
        answer = riddle.answer.toLowerCase();
        if (riddleId === 10){
            riddleId = 1;
        } else {
            riddleId++;
        }
        localStorage.setItem("riddle-id", riddleId);
    });
}

function submitAnswer() {
    let ans = document.getElementById("answer").value.toLowerCase();
    if (ans.length < 3)
        return;
    if (ans.includes(answer))
        win = true;
    gameResult();

}

const fetchRiddle = async riddleId => {
    let response = await fetch('static/js/riddles.json');
    let data = await response.json();
    riddle = data.riddles.find(item => item.id === riddleId);
    return riddle;
}

setRiddle();

// VIEW 1 CONTENT

$('#timer-length').text(timerLength);

// VIEW 2 CONTENT

$('#time-left').text(timerLength);

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left":"-=100vw"}, 300);
    
    gameTimer = setInterval(() => {
        timerLength--;
        $('#time-left').text(timerLength);
        if(timerLength === 0 && !win){
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
        data: {"task": 2, "progress": win? 1: 0},
        dataType: 'json',
    });
}

let gameResult = () => {
    submitResult();
    clearInterval(gameTimer);
    $('#view-2').css('background','white');
    $('#view-2').animate({'opacity': 0.2}, 300);
    $('#snake-container img').remove();
    if(win){
        $('#win-lose-messages').css('background', winColor);
        winMessageStart = winMessageStartArray[Math.floor(Math.random() * winMessageStartArray.length)];
        $('.win-lose-start').text(winMessageStart);
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)])
    }
    $('#view-3').fadeIn();
}

