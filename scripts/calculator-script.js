const display = document.getElementById('result');

function addToDisplay(input) {
    let currValue = display.value;
    currValue = currValue + input;
    display.value = currValue;
}

function calculate() {
    if (eval(display.value) == 'Infinity') {
        display.value = 'Error';
    }else{
        display.value = eval(display.value);
    }
}

function clearData() {
    display.value = '';
}

