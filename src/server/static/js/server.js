progress = [0, 0, 0];
timers = [0, 0, 0];
paused = [false, false, false]
leaderboards = [false, false, false]
var tid;

document.addEventListener('DOMContentLoaded', function () {
    loadTaskInfo();
    tid = setInterval(loadTaskInfo, 1000);
}, false);
loadTaskInfo();

function getVal(val) {
    console.log("Server IP = " + val)
}

function loadLeaderboard(game) {
    $.ajax({
        url: "/static/leaders/" + game + ".leaders",
        dataType: "text",
        success: function (data) {
            document.getElementById(game).innerHTML = "Scores for the " + game.replace("Scores", "") + " game:<br>" +
                "<table class='leaderboard'><tr><td>Name</td><td>Time</td></tr><tr><td>" +
                data.replaceAll("\n", "</td></tr><tr><td>").replaceAll(",", "</td><td>") + "</table>"
        }
    });

}


function danceLeaderboard() {
    leaderboards[0] = !leaderboards[0];
    loadLeaderboard("danceScores")
    if (leaderboards[0]) {
        $('#danceScores').fadeIn();
    } else
        $('#danceScores').fadeOut();
}

function riddleLeaderboard() {
    leaderboards[1] = !leaderboards[1];
    loadLeaderboard("riddleScores")
    if (leaderboards[1])
        $('#riddleScores').fadeIn();
    else
        $('#riddleScores').fadeOut();
}

function puzzleLeaderboard() {
    leaderboards[2] = !leaderboards[2];
    loadLeaderboard("puzzleScores")
    if (leaderboards[2])
        $('#puzzleScores').fadeIn();
    else
        $('#puzzleScores').fadeOut();
}

function resetRoom() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3000/reset-tasks",
        dataType: 'json',
    });
    tid = setInterval(loadTaskInfo, 1000);

}

function checkProgress(scores, limits) {
    let images = [["catch 1", "catch 2", "catch 3"],
        ["riddle 1", "riddle 2", "riddle 3"],
        ["tile 1", "tile 2", "tile 3"]]
    for (let i = 0; i < scores.length; i++) {
        for (let j = 0; j < limits.length; j++) {
            if (j >= Math.floor(((scores[i] / limits[i]) / 0.333333)))
                document.getElementById(images[i][j]).style.filter = "opacity(1) grayscale(1) blur(15px)";
            else
                document.getElementById(images[i][j]).style.filter = "none";
        }
    }
    if (JSON.stringify(scores) === JSON.stringify(limits)) {
        abortTimer()
        $('#win-lose-messages').css('background', "#4ed97f");
        winMessageStart = "Woo baby"
        $('.win-lose-start').text(winMessageStart);
        document.getElementById("restartButton").style.visibility = "hidden"
        $('.filter').remove();
        $('#view-3').fadeIn();
    }
}

function loadTaskInfo() {

    $.ajax({
        type: 'GET',
        url: "/get-tasks",
        dataType: 'json',
        success: function (response) {
            var toDoItems = response['list'];
            if (toDoItems === "old")
                return;
            var select = document.getElementById('toDoList');
            var count = Object.keys(toDoItems).length;
            select.size = count;
            $('#toDoList').empty();
            for (var i = 0; i < count; i++) {
                var opt = document.createElement('option');
                var item = toDoItems[i.toString()];
                if (item.includes("is currently playing.")) {
                    timers[i]++
                    var secs = timers[i] % 60 === 1 ? " second." : " seconds.";
                    if (timers[i] >= 60) {
                        var mins = Math.floor(timers[i] / 60) === 1 ? "minute and " : " minutes and ";
                        item += " Playing for " + Math.floor(timers[i] / 60) + mins + timers[i] % 60 + secs
                    } else
                        item += " Playing for " + timers[i] + secs
                } else
                    timers[i] = 0;
                opt.value = item;
                opt.innerHTML = item;
                progress[i] = item;
                select.appendChild(opt);
            }
            checkProgress(response['scores'], response['limits'])
        }
    });
}

function abortTimer() { // to be called when you want to stop the timer
    clearInterval(tid);
}