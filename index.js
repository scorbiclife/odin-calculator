const resultDisplayElement = document.querySelector("#result");

let result = 0;
function populateDisplay() {
  resultDisplayElement.textContent = Number.isInteger(result)
    ? String(result)
    : result.toFixed(5);
}

function init() {
  populateDisplay();
}

document.addEventListener("DOMContentLoaded", init);
