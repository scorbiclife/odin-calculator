const getLastOutput = (lastOutput, _currentInput) => lastOutput;
const replaceWithCurrentInput = (_lastOutput, currentInput) => currentInput;
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

let operator = replaceWithCurrentInput;
let lastOutput = 0;
let currentInput = [];
let lastInputType = "operator"; /* "number" or "operator" or "error" */
let dotInputDuringNumberInput = false;

function clear() {
  operator = replaceWithCurrentInput;
  lastOutput = 0;
  currentInput = [];
  lastInputType = "operator";
}

function inputDigit(digitInput) {
  if (lastInputType === "error") {
    return;
  }
  if (lastInputType === "number" || lastInputType === "operator") {
    currentInput.push(digitInput);
    lastInputType = "number";
    return;
  }
  throw new Error("Invalid state!");
}

function removeDigit() {
  if (lastInputType === "error") {
    return;
  }
  if (lastInputType === "number") {
    if (currentInput.length > 0) {
      currentInput.pop();
    }
    return;
  }
  if (lastInputType === "operator") {
    return;
  }
  throw new Error("Invalid state!");
}

function inputOperator(operatorInput) {
  if (lastInputType === "error") {
    return;
  }
  if (lastInputType === "number") {
    const currentInputNumber =
      currentInput.length === 0 ? 0 : Number(currentInput.join(""));
    lastOutput = operator(lastOutput, currentInputNumber);
    currentInput = [];
    operator = operatorInput;
    lastInputType = Number.isFinite(lastOutput) ? "operator" : "error";
    dotInputDuringNumberInput = false;
    return;
  }
  if (lastInputType === "operator") {
    currentInput = [];
    operator = operatorInput;
    lastInputType = "operator";
    dotInputDuringNumberInput = false;
    return;
  }
  throw new Error("Invalid state!");
}

function formatNumber(x) {
  return Number.isInteger(x) ? String(x) : x.toFixed(5);
}

function getTextToDisplay() {
  if (lastInputType === "number") {
    return currentInput.join("");
  }
  if (lastInputType === "operator") {
    return formatNumber(lastOutput);
  }
  return "Error! X.X";
}

const resultDisplayElement = document.querySelector("#result");

function populateDisplay() {
  resultDisplayElement.textContent = getTextToDisplay();
}

const dotButton = document.querySelector("#symbol-dot");

function refreshDotButton() {
  dotButton.disabled = dotInputDuringNumberInput;
}

function updateView() {
  populateDisplay();
  refreshDotButton();
}

for (let i = 0; i <= 9; ++i) {
  document.querySelector(`#number-${i}`)?.addEventListener("click", () => {
    inputDigit(`${i}`);
    updateView();
  });
}

dotButton?.addEventListener("click", () => {
  inputDigit(".");
  dotInputDuringNumberInput = true;
  updateView();
});

document.querySelector("#symbol-plus")?.addEventListener("click", () => {
  inputOperator(add);
  updateView();
});

document.querySelector("#symbol-minus")?.addEventListener("click", () => {
  inputOperator(subtract);
  updateView();
});

document.querySelector("#symbol-times")?.addEventListener("click", () => {
  inputOperator(multiply);
  updateView();
});

document.querySelector("#symbol-division")?.addEventListener("click", () => {
  inputOperator(divide);
  updateView();
});

document.querySelector("#symbol-equals")?.addEventListener("click", () => {
  inputOperator(getLastOutput);
  updateView();
});

document.querySelector("#control-backspace")?.addEventListener("click", () => {
  removeDigit();
  updateView();
});

document.querySelector("#control-clear")?.addEventListener("click", () => {
  clear();
  updateView();
});

function init() {
  clear();
  updateView();
}

document.addEventListener("DOMContentLoaded", init);
