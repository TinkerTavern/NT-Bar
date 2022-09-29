const loginForm = document.getElementById("config-form");
loginForm.addEventListener("submit", submitForm);

function submitForm(e) {
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    localStorage.setItem("spawnFreq", formProps["spawnFreq"])
    localStorage.setItem("badStep", formProps["badStep"])
    localStorage.setItem("stepCount", formProps["stepCount"])
    localStorage.setItem("winScore", formProps["winScore"])
    localStorage.setItem("timeOn", formProps["timeOn"])
    localStorage.setItem("fadeOut", formProps["fadeOut"])
    localStorage.setItem("debug", formProps["debug"])
    localStorage.setItem("hideLeaderboard", formProps["hideLeaderboard"])
    localStorage.setItem("hideProgress", formProps["hideProgress"])
    e.preventDefault()
    alert("Changes saved successfully")
    window.location.href = "/master-the-dance";
}