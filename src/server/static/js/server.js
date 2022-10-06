progress = [0, 0, 0];
timers = [0, 0, 0];
var attempts = [0, 0, 0];
var playerCount = [0, 0, 0];
playing = [false, false, false]
paused = [false, false, false]
leaderboards = [false, false, false]
var tid;

document.addEventListener('DOMContentLoaded', function () {
    loadTaskInfo();
    tid = setInterval(loadTaskInfo, 1000);
}, false);
loadTaskInfo();
window.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13 ) {
        resetRoom();
    }
    if (event.keyCode === 114 || event.which === 114) {
        resetTimers();
    }
});

function getVal(val) {
    console.log("Server IP = " + val)
}

function loadLeaderboard(game) {
    $.ajax({
        url: "/static/leaders/" + game + ".leaders",
        dataType: "text",
        success: function (data) {
            let scoreInfo = game.replace("Scores", "") === "puzzle" ? "Lower is better" : "Higher is better"
            let unit = game.replace("Scores", "") === "dance" ? "Points" : game.replace("Scores", "") === "puzzle" ? "Time taken (s)" : "Time left (s)"
            document.getElementById(game).innerHTML = "Scores for the " + game.replace("Scores", "") + " game. " + scoreInfo + ":<br>" +
                "<table class='leaderboard'><tr><th>Name</th><th>" + unit + "</th></tr><tr><td>" +
                data.replaceAll("\n", "</td></tr><tr><td>").replaceAll(",", "</td><td>") + "</table>"
        }
    });

}

function resetRoom() {
    alert("Resetting room...")
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3000/reset-tasks",
        dataType: 'json',
    });
    tid = setInterval(loadTaskInfo, 1000);
}

function resetTimers() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3000/reset-timers",
        dataType: 'json',
    });
    timers = [0, 0, 0];
}

function checkProgress(scores, limits) {
    let images = [["catch1", "catch2", "catch3"],
        ["riddle1", "riddle2", "riddle3"],
        ["tile1", "tile2", "tile3"]]
    let words = ["catch-word", "riddle-word", "tile-word"]
    let won = true
    for (let i = 0; i < scores.length; i++) {
        if (parseInt(limits[i]) > parseInt(scores[i])) {
            document.getElementById(words[i]).style.display = "none";
            won = false
        }
        else
            document.getElementById(words[i]).style.display = "block";
        for (let j = 0; j < limits.length; j++) {
            if (j >= Math.floor(((scores[i] / limits[i]) / 0.333333))) {
                document.getElementById(images[i][j]).style.filter = "blur(35px)";
            } else {
                document.getElementById(images[i][j]).style.filter = "none";
            }
        }
    }
    if (won) {
        abortTimer()
        document.getElementById("server-grid").style.display = "none"
        winMessageStart = "After an evening of games & dances, you come back to Isobel, hoping that the hints you’ve gathered are enough for you and her to put it all together. You ask her if she’s given a servant, likely a woman, someone particularly close to her, a reason to hold a grudge?\n" +
            "\n" +
            "At first, Isobel looks confused, with an early denial. The initial shock passed, she slowly nods her head in understanding: “Marguerite!” she says, “My former maid. I had to terminate her employment this morning at Frederick’s request. She was to leave the premises by tomorrow. Do you really think it could be her?”\n" +
            "\n" +
            "With a purposeful stroll, you come together to the servants’ quarters in the outbuildings, determined to question her and put this whole unpleasantness to a rest. Isobel knocks at the door, announcing herself, then you both enter the room resolutely to confront Marguerite, Isobel’s former maid and the Earl’s likely murderer.\n" +
            "\n" +
            "Marguerite, who lies dead on the floor, in a pool of crimson red.\n" +
            "It would seem your investigation has only just started."
        $('.win-lose-start').text(winMessageStart);
        $('.win-title').text("Win")
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
            attempts = response['attempts'];
            playerCount = response['playerCount'];
            if (toDoItems === "old")
                return;
            var ids = ["dance", "riddle", "puzzle"]
            var count = Object.keys(toDoItems).length;
            for (var i = 0; i < count; i++) {
                var att = attempts[i] !== 1 ? " attempts have" : " attempt has"
                var attemptsText = "\n " + attempts[i] + att + " been made so far, by "
                var ply = playerCount[i] !== 1 ? " different players." : " player."
                var playersPlayed = playerCount[i] + ply
                var item = toDoItems[i.toString()];
                timers[i]++
                if (item.includes("! ")) {
                    if (!playing[i]) {
                        timers[i] = 0
                        playing[i] = true
                    }
                    var secs = timers[i] % 60 === 1 ? " second." : " seconds.";
                    if (timers[i] >= 60) {
                        var mins = Math.floor(timers[i] / 60) === 1 ? "minute and " : " minutes and ";
                        item += " has been playing for " + Math.floor(timers[i] / 60) + mins + timers[i] % 60 + secs + attemptsText + playersPlayed
                    } else
                        item += " has been playing for " + timers[i] + secs + attemptsText + playersPlayed
                } else if (item.includes("!\n")) {
                    if (playing[i]) {
                        timers[i] = 0
                        playing[i] = false
                    }
                    var secs = timers[i] % 60 === 1 ? " second ago." : " seconds ago.";
                    if (timers[i] >= 60) {
                        var mins = Math.floor(timers[i] / 60) === 1 ? " minute and " : " minutes and ";
                        item += " last played " + Math.floor(timers[i] / 60) + mins + timers[i] % 60 + secs + attemptsText + playersPlayed
                    } else
                        item += " last played " + timers[i] + secs + attemptsText + playersPlayed
                } else {
                    item += "\nNot played yet"
                }
                document.getElementById(ids[i]).innerHTML = item;
                progress[i] = item;
            }
            checkProgress(response['scores'], response['limits'])
        }
    });
    loadLeaderboard("danceScores")
    loadLeaderboard("charadesScores")
    loadLeaderboard("needlepointScores")
}

function abortTimer() { // to be called when you want to stop the timer
    clearInterval(tid);
}