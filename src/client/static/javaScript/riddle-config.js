const loginForm = document.getElementById("config-form");
loginForm.addEventListener("submit", submitForm);

function submitForm(e) {
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    localStorage.setItem("orderToSolve", formProps["noToSolve"])
    localStorage.setItem("timeToSolve", formProps["timeToSolve"])
    localStorage.setItem("multipleChoiceChoices", formProps["multipleChoiceChoices"])
    localStorage.setItem("multiChoice", formProps["multiChoice"])
    localStorage.setItem("hideLeaderboard", formProps["hideLeaderboard"])
    localStorage.setItem("hideProgress", formProps["hideProgress"])
    localStorage.setItem("hideScoreInfo", formProps["hideScoreInfo"])
    e.preventDefault()
    alert("Changes saved successfully")
    window.location.href = "/charades";
}