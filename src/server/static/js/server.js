progress = [0, 0, 0];
var tid;
document.addEventListener('DOMContentLoaded', function () {
    loadTaskInfo();
    tid = setInterval(loadTaskInfo, 1000);
}, false);
loadTaskInfo();

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
        console.log("woo baby")
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
                opt.value = toDoItems[i.toString()];
                opt.innerHTML = toDoItems[i.toString()];
                progress[i] = toDoItems[i.toString()];
                select.appendChild(opt);
            }
            checkProgress(response['scores'], response['limits'])
        }
    });
}

function abortTimer() { // to be called when you want to stop the timer
    clearInterval(tid);
}