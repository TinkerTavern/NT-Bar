progress = [0, 0, 0];
document.addEventListener('DOMContentLoaded', function () {
}, false);

function setAddr() {
    localStorage.setItem("addr", document.getElementById("addr").value)
}

function clearConfigs() {
    localStorage.clear();
}