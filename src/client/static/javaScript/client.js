progress = [0, 0, 0];
document.addEventListener('DOMContentLoaded', function () {
}, false);

function setAddr() {
    let url = document.getElementById("addr").value !== "" ? document.getElementById("addr").value : "127.0.0.1"
    url = "http://" + url + ":3000"
    $.ajax({
        url: url + "/ping",
        dataType: "json",
        success: function (data) {
            if (data['ping'] === "pong") {
                localStorage.setItem("addr", document.getElementById("addr").value)
                alert("Server address changed successfully")
            } else {
                alert("Server address not changed, server config issue")
            }
        },
        error: function () {
            alert("Server address not changed, server not found")
        }
    });
    $.ajax({
        type: 'GET',
        url: url + "/get-ip",
        dataType: 'json',
    });
}

function clearConfigs() {
    localStorage.clear();
}