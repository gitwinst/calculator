
// 
// 
/* DOM Elements & Event Listeners */
// 
// 

const numberButtons = document.getElementById('numbers');
numberButtons.addEventListener( 'click', handleOperand);

const operatorButtons = document.getElementById('operators');
operatorButtons.addEventListener( 'click', handleOperator);

const calculateButton = document.getElementById('calculate');
calculateButton.addEventListener('click', calculate);

const allClearButton = document.getElementById('all-clear');
allClearButton.addEventListener('click', clearAllEntries);

const clearEntryButton = document.getElementById('clear-entry');
clearEntryButton.addEventListener('click', clearLastEntry);

const historyDisplay = document.getElementById('history');
const resultDisplay = document.getElementById('result');

document.addEventListener('keydown', handleKeyboardInput);




let colorBtns = document.getElementById('color-scheme');

colorBtns.addEventListener('mouseover', (e) => {
    let btn = e.target.closest('button');
    if (btn) {
        Array.from(colorBtns.children).forEach(element => {
            element.classList.remove('hovered');
        });
        btn.classList.add('hovered');
    }
    e.stopPropagation();
});

colorBtns.addEventListener('mouseout', (e) => {
    let btn = e.target.closest('button');
    if (btn) {
        btn.classList.remove('hovered');
    }
});

colorBtns.addEventListener('click', (e) => {
    let btn = e.target.closest('button');
    if (btn) {
        Array.from(colorBtns.children).forEach(element => {
            element.classList.remove('active');
            element.classList.add('inactive');
        });
        btn.classList.add('active');
        btn.classList.remove('inactive');
    }
    e.stopPropagation();
});





// 
// 
/* Data Structures */
// 
// 

const calc = {
    num1: null,
    num2: null,
    op: null,
    calculationInProgress: false
};

let result;

const display = {
    main: '',
    sub: ''
};

const keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '/', '*', '-', '+', '=', 'Backspace', 'Enter'];

// 
// 
/* User Input Handling */
// 
// 

function handleOperand(e) {
    if (e.target.id === 'numbers') return; // ignores clicks on container div

    const userInput = processUserInputFromEvent(e, 'operand');

    if (display.main.length > 8) return;

    if (calc.op === null && calc.calculationInProgress === true) {
        calc.num1 = formatInput(calc.num1, userInput);
        
        calc.calculationInProgress = false;
        display.sub = '';
        display.main = calc.num1;

    } else if (calc.op === null) {
        if ( checkForDecimal(calc.num1, userInput) ) return;

        calc.num1 = formatInput(calc.num1, userInput);

        display.sub = '';
        display.main = calc.num1;

    } else {
        if ( checkForDecimal(calc.num2, userInput) ) return;

        calc.num2 = formatInput(calc.num2, userInput);

        display.main = calc.num2;
    }

    updateDisplay();
}

function handleOperator(e) {
    if (e.target.id === 'operators') return; // ignores clicks on container div

    // if operator is set before num1, assume num1 is 0
    if (calc.num1 === null) calc.num1 = '0';

    // if num2 is set and operator is already set, calculate
    if (calc.num2 !== null) calculate();

    calc.calculationInProgress = false;

    const userInput = processUserInputFromEvent(e, 'operator');

    calc.op = userInput;

    display.sub = `${Number(calc.num1)} ${calc.op.symbol}`;
    display.main = '';

    updateDisplay();
}

function handleKeyboardInput(e) {
    if (keys.includes(e.key)) {
        console.log(e.key);

        if (e.key === 'Enter') {
            e.preventDefault();
        }

        if ( Number.isInteger(Number(e.key)) || e.key === '.' ) {
            handleOperand(e);
        } else if (e.key === '=' || e.key === 'Enter') {
            calculate();
        } else if (e.key === 'Backspace') {
            clearLastEntry();
        } else {
            handleOperator(e);
        }
    }
}

function processUserInputFromEvent(e, type) {
    let input;
    if (e.type === 'keydown') {
        input = e.key;
    } else {
        input = e.target.id;
    }

    if (type === 'operand') {
        return input;
    } else {
        return operations.find( operation => operation.symbol === input);
    }
}

// 
// 
/* Data Processing */
// 
// 

function checkForDecimal(num, userInput) {
    if (num && userInput === '.' && num.includes('.')) return true;
}

function formatInput(num, userInput) {
    if ( (num === null && userInput === '.') || (calc.calculationInProgress === true && userInput === '.') ) {
        num = '0' + userInput;
    } else if (num === null || calc.calculationInProgress === true) {
        num = userInput;
    } else if (num === '0' && userInput === '0') {
        num = userInput;
    } else {
        num += userInput;
    }

    // if (num.length > 12) {
    //     num = num.slice(0, 12);
    // }

    return num;
}

function calculate() {
    if (!readyToCalculate()) return;
    if (checkDivideByZero()) return;

    const opName = calc.op.name;
    result = Number(calc.op[opName](Number(calc.num1), Number(calc.num2)).toFixed(6));
    display.sub = `${Number(calc.num1)} ${calc.op.symbol} ${Number(calc.num2)} =`;
    display.main = numberWithCommas(result);
    console.log(`${Number(calc.num1)} ${calc.op.symbol} ${Number(calc.num2)} = ${result}`);
    
    updateDisplay();
    prepareForNextCalculation();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// 
// 
/* Data Output */
// 
// 

function updateDisplay() {
    resultDisplay.textContent = display.main === null ? display.main : numberWithCommas(display.main);
    historyDisplay.textContent = numberWithCommas(display.sub);
}

// 
// 
/* Misc. Calculator Functionality */
// 
// 

function readyToCalculate() {
    if (calc.op === null) return false; // checks that operation is set (and by extension operand1, which must be set before the operation)
    if (calc.num2 === null) return false; // checks that operand 2 is set
    
    console.log('ready to calculate...');
    return true;
}

function checkDivideByZero() {
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
    calc.calculationInProgress = false;
    result = null;
}

function prepareForNextCalculation() {
    calc.num1 = String(result);
    calc.num2 = null;
    calc.op = null;
    calc.calculationInProgress = true;
    result = null;
}

function clearAllEntries() {
    resetCalculation();
    display.main = '';
    display.sub = '';
    updateDisplay();
}

function clearLastEntry() {
    if (calc.calculationInProgress) return;

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

// 
// 
/* Mathmatical Operations Library */
// 
// 

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
