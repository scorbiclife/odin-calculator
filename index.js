const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

/**
 * { step: "error" }
 * or { step: "num1", input1: string[] }
 * or { step: "op", number1: number, operator: function }
 * or { step: "num2", number1: number, operator: function, input2: string[] }
 * or { step: "result", number: number }
 */
let currentState = {
  step: "result",
  number: 0,
};
let dotInputDuringNumberInput = false;

function clear() {
  currentState = {
    step: "result",
    number: 0,
  };
  dotInputDuringNumberInput = false;
}

function inputDigit(digitInput) {
  switch (currentState.step) {
    case "error":
      return;
    case "num1":
      currentState.input1.push(digitInput);
      return;
    case "op":
      currentState = {
        step: "num2",
        number1: currentState.number1,
        operator: currentState.operator,
        input2: [digitInput],
      };
      return;
    case "num2":
      currentState.input2.push(digitInput);
      return;
    case "result":
      // when you input a digit after a result,
      // the old result is cleared and a new calculation is started with the new input.
      currentState = {
        step: "num1",
        input1: [digitInput],
      };
      return;
    default:
      throw new Error("Invalid state!");
  }
}

function removeDigit() {
  switch (currentState.step) {
    case "error":
      return;
    case "num1":
      currentState.input1.pop();
      return;
    case "op":
      return;
    case "num2":
      currentState.input2.pop();
      return;
    case "result":
      return;
    default:
      throw new Error("Invalid state!");
  }
}

function getNumberFromInput(input) {
  return input.length === 0 ? 0 : Number(input.join(""));
}

function inputOperator(operator) {
  dotInputDuringNumberInput = false;
  switch (currentState.step) {
    case "error":
      return;
    case "num1":
      currentState = {
        step: "op",
        number1: getNumberFromInput(currentState.input1),
        operator,
      };
      return;
    case "op":
      // When two consecutive operators are entered, only the last one takes effect.
      currentState = {
        step: "op",
        number1: currentState.number1,
        operator,
      };
      return;
    case "num2":
      getResult();
      inputOperator(operator);
      return;
    case "result":
      currentState = {
        step: "op",
        number1: currentState.number,
        operator,
      };
      return;
    default:
      throw new Error("Invalid state!");
  }
}

function operate(operator, number1, number2) {
  const result = operator(number1, number2);
  if (Number.isFinite(result)) {
    currentState = {
      step: "result",
      number: result,
    };
  } else {
    // if the result is an invalid number (infinity or NaN), go to error state.
    currentState = {
      step: "error",
    };
  }
}

function getResult() {
  dotInputDuringNumberInput = false;
  switch (currentState.step) {
    case "error":
      return;
    case "num1":
      currentState = {
        step: "result",
        number: getNumberFromInput(currentState.input1),
      };
      return;
    case "op":
      operate(
        currentState.operator,
        currentState.number1,
        currentState.number1
      );
      return;
    case "num2": {
      operate(
        currentState.operator,
        currentState.number1,
        getNumberFromInput(currentState.input2)
      );
      return;
    }
    case "result":
      return;
    default:
      throw new Error("Invalid state!");
  }
}

function formatNumber(x) {
  return Number.isInteger(x) ? String(x) : x.toFixed(5);
}

function getTextToDisplay() {
  switch (currentState.step) {
    case "error":
      return "Error! X.X";
    case "num1":
      return formatNumber(getNumberFromInput(currentState.input1));
    case "op":
      return formatNumber(currentState.number1);
    case "num2":
      return formatNumber(getNumberFromInput(currentState.input2));
    case "result":
      return formatNumber(currentState.number);
    default:
      throw new Error("Invalid state!");
  }
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
  getResult();
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
