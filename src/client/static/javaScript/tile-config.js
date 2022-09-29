const loginForm = document.getElementById("config-form");
loginForm.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault()
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    localStorage.setItem("noToSolve", formProps["noToSolve"])
    localStorage.setItem("timer", formProps["timer"])
    localStorage.setItem("preview", formProps["preview"])
    localStorage.setItem("postview", formProps["postview"])
    localStorage.setItem("4xMode", formProps["4xMode"])
    localStorage.setItem("slideMode", formProps["slideMode"])
    localStorage.setItem("previewTimer", formProps["previewTimer"])
    localStorage.setItem("hideLeaderboard", formProps["hideLeaderboard"])
    localStorage.setItem("hideProgress", formProps["hideProgress"])
    alert("Changes saved successfully")
    window.location.href = "/needlepoint";
}