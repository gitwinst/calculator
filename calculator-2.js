
/* DOM Elements & Event Listeners */

const numberButtons = document.getElementById('numbers');
numberButtons.addEventListener( 'click', handleOperand);

const operatorButtons = document.getElementById('operators');
operatorButtons.addEventListener( 'click', handleOperator);

const equalsButton = document.getElementById('equals');
equalsButton.addEventListener('click', calculate);

const allClearButton = document.getElementById('all-clear');
allClearButton.addEventListener('click', allClear);

const clearEntryButton = document.getElementById('clear-entry');
clearEntryButton.addEventListener('click', clearEntry);

const historyDisplay = document.getElementById('history');
const resultDisplay = document.getElementById('result');



/* Calculation Object */

const calc = {
    num1: null,
    num2: null,
    op: null,
    continuingCalculation: false
};

let result;

const display = {
    main: '',
    sub: ''
};


/* Processing User Input */

function handleOperand(e) {
    if (e.target.id === 'numbers') return; // ignores clicks on container div

    const newNum = e.target.textContent;

    if (calc.op === null && calc.continuingCalculation === true) {

        if (newNum === '.') {
            calc.num1 = '0' + newNum;
        } else {
            calc.num1 = newNum;
        }

        calc.continuingCalculation = false;
        console.log(`Num1: ${Number(calc.num1)}`);
        display.sub = '';
        display.main = calc.num1;

    } else if (calc.op === null) {
        // checks that num1 is not null, that user just entered '.', and num1 isn't already a float
        if (calc.num1 && newNum === '.' && calc.num1.includes('.')) return;
        
        if (calc.num1 === null && newNum === '.') {
            calc.num1 = '0' + newNum;
        } else if (calc.num1 === null) {
            calc.num1 = newNum;
        } else {
            calc.num1 += newNum;
        }

        console.log(`Num1: ${calc.num1}`);
        display.sub = '';
        display.main = calc.num1;

    } else {
        if (calc.num2 && newNum === '.' && calc.num2.includes('.')) return;

        if (calc.num2 === null && newNum === '.') {
            calc.num2 = '0' + newNum;
        } else if (calc.num2 === null) {
            calc.num2 = newNum;
        } else{
            calc.num2 += newNum;
        }

        console.log(`Num2: ${Number(calc.num2)}`);
        display.main = calc.num2;
    }

    updateDisplay();
}

function handleOperator(e) {
    if (e.target.id === 'operators') return; // ignores clicks on container div

    if (calc.num1 === null) { // if operator is set before num1, assume num1 is 0
        calc.num1 = '0';
    }
    if (calc.num2 !== null) { // if num2 is set and then operator is set again, clear num2
        calc.num2 = null;
    }

    calc.op = operations.find( operation => operation.name === e.target.id );

    display.sub = `${Number(calc.num1)} ${calc.op.symbol}`;
    display.main = '';    
    console.log(calc.op);

    updateDisplay();
}

/* Data Processing */

function calculate() {
    if (!readyToCalculate()) return;
    if (divideByZero()) return;

    const opName = calc.op.name;
    result = calc.op[opName](Number(calc.num1), Number(calc.num2));
    display.sub = `${Number(calc.num1)} ${calc.op.symbol} ${Number(calc.num2)} =`;
    display.main = result;
    console.log(`${Number(calc.num1)} ${calc.op.symbol} ${Number(calc.num2)} = ${result}`);
    
    updateDisplay();
    prepareForNextCalculation();
}

function readyToCalculate() {
    if (calc.op === null) return false; // checks that operation is set (and by extension operand1, which must be set before the operation)
    if (calc.num2 === null) return false; // checks that operand 2 is set
    
    console.log('ready to calculate...');
    return true;
}

function divideByZero() {
    if (calc.op.name === 'divide' && Number(calc.num2) === 0) {
        display.sub = `${Number(calc.num1)} ${calc.op.symbol} ${Number(calc.num2)} =`;
        display.main = 'ERROR';
        console.log('Woops! No dividing by zero.');

        updateDisplay();
        resetCalculation();
        return true;
    }

    return false;
}

function resetCalculation() {
    calc.num1 = null;
    calc.num2 = null;
    calc.op = null;
    result = null;
}

function prepareForNextCalculation() {
    calc.num1 = String(result);
    calc.num2 = null;
    calc.op = null;
    calc.continuingCalculation = true;
    result = null;
}

function allClear() {
    resetCalculation();
    display.main = '';
    display.sub = '';
    updateDisplay();
}

function clearEntry() {
    if (calc.num2) {
        calc.num2 = calc.num2.slice(0, calc.num2.length-1);
        if (calc.num2.length === 0) {
            calc.num2 = null;
        }
        display.main = calc.num2;

    } else if (calc.op) {
        calc.op = null;
        display.sub = '';
        display.main = calc.num1;

    } else if (calc.num1) {
        calc.num1 = calc.num1.slice(0, calc.num1.length-1);
        if (calc.num1.length === 0) {
            calc.num1 = null;
        }
        display.main = calc.num1;
    }

    updateDisplay();
}

/* Data Output */
function updateDisplay() {
    resultDisplay.textContent = display.main;
    historyDisplay.textContent = display.sub;
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
