
let num1 = 0;
let num2 = 0;
let operationName = null;
let operationObject = null;
let result;
let continuingCalculation = false;

const numberButtons = document.getElementById('numbers');
numberButtons.addEventListener( 'click', queueOperand);
const operatorButtons = document.getElementById('operators');
operatorButtons.addEventListener( 'click', queueOperator);
const equalsButton = document.getElementById('equals');
equalsButton.addEventListener('click', calculate);

function queueOperand(e) {
    if (e.target.id === 'numbers') return;

    const number = e.target.id;
    if (operationObject === null && continuingCalculation === true) {
        num1 = 0;
        num1 = number;
        continuingCalculation = false;
        console.log(`Num1: ${Number(num1)}`);
    } else if (operationObject === null) {
        num1 += number;
        console.log(`Num1: ${Number(num1)}`);
    } else {
        num2 += number;
        console.log(`Num2: ${Number(num2)}`);
        // calculate(num1, num2, operator);
    }
}

function queueOperator(e) {
    if (e.target.id === 'operators') return;
    operationName = e.target.id;
    operationObject = operations.find( (operation) => operation.name === operationName );
    
    console.log(operationObject);
}

function calculate() {
    result = operationObject[operationName](Number(num1), Number(num2));
    console.log(`${Number(num1)} ${operationObject.symbol} ${Number(num2)} = ${result}`);

    resetForNextCalculation()
}

function resetForNextCalculation() {
    num1 = result;
    num2 = 0;
    result = null;
    operationName = null;
    operationObject = null;
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
