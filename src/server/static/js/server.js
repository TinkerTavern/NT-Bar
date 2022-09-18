progress = [0, 0, 0];
document.addEventListener('DOMContentLoaded', function () {
    loadTaskInfo();
    var tid = setInterval(loadTaskInfo, 1000);
}, false);

loadTaskInfo();


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
        }
    });
}

function abortTimer() { // to be called when you want to stop the timer
    clearInterval(tid);
}