// GAME PARAMETERS

const snakeNumArray = [15, 20];
const timerLengthArray = [10, 15];


let snakeNum = snakeNumArray[Math.floor(Math.random() * snakeNumArray.length)]
$.ajax({
    type: 'POST',
    url: "http://127.0.0.1:5000/update",
    data: {"task": 0, "progress": 0, "limit": snakeNum},
    dataType: 'json',
});
let timerLength = timerLengthArray[Math.floor(Math.random() * timerLengthArray.length)]

const winColor = "#4ed97f";
const loseColor = "#de5f5f";

const winMessageStartArray = ["You did it!", "Great!", "Nice job!", "Good work!"];
const loseMessageStartArray = ["Oh no!", "Not this time!", "Better luck next time!", "Nice try!"];

let snakeTop, snakeLeft, snakeScale;
let winMessageStart;

let snakesCaught = 0;


// VIEW 1 CONTENT

$('#snake-num').text(snakeNum);
$('#timer-length').text(timerLength);

// VIEW 2 CONTENT

$('#time-left').text(timerLength);
$('#snake-goal').text(snakeNum);
$('#snakes-caught').text(snakesCaught);

function updateScore() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/update",
        data: {"task": 0, "progress": snakesCaught},
        dataType: 'json',
    });
}

$('.play').on('click tap', (e) => {
    $('#view-1').animate({"left": "-=100vw"}, 300);
    $('#view-2').animate({"left": "+=100vw"}, 300);
    moveSnake();

    const gameTimer = setInterval(() => {
        timerLength--;
        $('#time-left').text(timerLength);
        if (timerLength === 0 || snakeNum < 1) {
            clearInterval(gameTimer);
            $('#view-2').animate({'opacity': 0.2}, 300);
            gameResult();
        }
    }, 1000);
    updateScore();
})

$('#snake-container img').on('click tap', (e) => {
    moveSnake();
    snakeNum--;
    snakesCaught++;
    $('#snakes-caught').text(snakesCaught);
    if (snakeNum < 1) {
        gameResult();
    }
    updateScore();
})

let moveSnake = () => {
    snakeTop = Math.floor(Math.random() * 45 + 10);
    snakeLeft = Math.floor(Math.random() * 60 + 10);
    snakeScale = Math.floor(Math.random() * 10 + 10);
    $('#snake-container img').css({
        'top': `${snakeTop}vh`,
        'left': `${snakeLeft}vw`,
        'width': `${snakeScale}vw`
    })
}

// VIEW 3 CONTENT

let gameResult = () => {
    $('#snake-container img').remove();
    if (snakeNum < 1) {
        $('#win-lose-messages').css('background', winColor);
        winMessageStart = winMessageStartArray[Math.floor(Math.random() * winMessageStartArray.length)];
        $('.win-lose-start').text(winMessageStart);
    } else {
        $('#win-lose-messages').css('background', loseColor);
        $('.win-lose-start').text(loseMessageStartArray[Math.floor(Math.random() * loseMessageStartArray.length)])
    }
    $('#view-3').fadeIn();
}

