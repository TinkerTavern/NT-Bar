progress = [0, 0, 0];
document.addEventListener('DOMContentLoaded', function () {
    loadTaskInfo();
    var tid = setInterval(loadTaskInfo, 1000);
}, false);

loadTaskInfo();

function resetRoom() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3000/reset-tasks",
        dataType: 'json',
    });
}

function checkProgress(scores, limits) {
    let images = [["catch 1", "catch 2", "catch 3"],
        ["riddle 1", "riddle 2", "riddle 3"],
        ["tile 1", "tile 2", "tile 3"]]
    // console.log(scores)
    // console.log(limits)
    for (var i = 0; i < scores.length; i++) {
        console.log("Score")
        console.log(scores[i] / limits[i])
        for (var j = 0; j < Math.floor(scores[i] / limits[i]); j++) {
            console.log(images[i][j])
            document.getElementById(images[i][j]).style.filter = "none";
        }
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