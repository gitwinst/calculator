
let num1 = 0;
let num2 = 0;
let operationObj = null;
let result;
let continuingCalculation = false;

const numberButtons = document.getElementById('numbers');
numberButtons.addEventListener( 'click', queueOperand);
const operatorButtons = document.getElementById('operators');
operatorButtons.addEventListener( 'click', queueOperator);
const equalsButton = document.getElementById('equals');
equalsButton.addEventListener('click', calculate);
const historyDisplay = document.getElementById('history');
const resultDisplay = document.getElementById('result');

function queueOperand(e) {
    if (e.target.id === 'numbers') return; // ignores clicks on container div

    const newNumber = e.target.id;
    if (operationObj === null && continuingCalculation === true) {
        num1 = 0;
        num1 = newNumber;
        continuingCalculation = false;
        console.log(`Num1: ${Number(num1)}`);
    } else if (operationObj === null) {
        num1 += newNumber;
        console.log(`Num1: ${Number(num1)}`);
    } else {
        num2 += newNumber;
        console.log(`Num2: ${Number(num2)}`);
    }
}

function queueOperator(e) {
    if (e.target.id === 'operators') return; // ignores clicks on container div

    operationObj = operations.find( (operation) => operation.name === e.target.id );
    console.log(operationObj);
}

function calculate() {
    const operationName = operationObj.name;
    result = operationObj[operationName](Number(num1), Number(num2));
    console.log(`${Number(num1)} ${operationObj.symbol} ${Number(num2)} = ${result}`);

    resetForNextCalculation()
}

function resetForNextCalculation() {
    num1 = result;
    num2 = 0;
    result = null;
    operationObj = null;
    continuingCalculation = true;
}

const operations = [
    {
        name: "add",
        symbol: "+",
        add(a, b) {
            return a + b;
        }
    },
    {
        name: "subtract",
        symbol: "-",
        subtract(a, b) {
            return a - b;
        }
    },
    {
        name: "multiply",
        symbol: "*",
        multiply(a, b) {
            return a * b;
        }
    },
    {
        name: "divide",
        symbol: "/",
        divide(a, b) {
            return a / b;
        }
    }
]
