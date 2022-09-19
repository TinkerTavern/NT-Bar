const loginForm = document.getElementById("config-form");
loginForm.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    console.log(formProps)
    if (formProps["debug"] === "on")
        localStorage.setItem("debug", "on")
    else
        localStorage.setItem("debug", "off")
    localStorage.setItem("spawnFreq", formProps["spawnFreq"])
    localStorage.setItem("badStep", formProps["badStep"])
    localStorage.setItem("stepCount", formProps["stepCount"])
    localStorage.setItem("winScore", formProps["winScore"])
    localStorage.setItem("timeOn", formProps["timeOn"])
    localStorage.setItem("fadeOut", formProps["fadeOut"])
}