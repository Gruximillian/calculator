window.addEventListener('load', initCalc);

function initCalc() {
  var buttons = document.querySelectorAll('.calc-buttons input'),
      i, len = buttons.length,
      display = document.querySelector('#display'),
      expression = '',
      operations = ['+', '-', '*', '/'],
      operator,
      operationDisplay = document.querySelector('#operation'),
      operationCharacter = '',
      number = /\d|\./;

  // Empty display on reload
  display.value = '';

  for ( i = 0; i < len; i++ ) {
    buttons[i].addEventListener('click', action);
  }

  function action() {
    var input = this.value,
        id = this.id,
        displayValue = display.value,
        i;

    if ( input === 'C' ) {
      expression = '';
      display.value = '';
      operationDisplay.style.display = 'none';
    }

    if ( input === 'DEL' ) {
      display.value = displayValue.slice(0, displayValue.length - 1);
      if ( !display.value ) {
        operationDisplay.style.display = 'none';
      }
    }

    if ( id === 'plus-minus' && displayValue ) {
      display.value = displayValue * (-1); // changing the sign
    }

    if ( operations.indexOf(id) !== -1 ) {
      operator = id;
      if ( operator === '*' ) {
        operationCharacter = '×';
      } else if ( operator === '/' ) {
        operationCharacter = '÷';
      } else {
        operationCharacter = operator;
      }
      operationDisplay.textContent = operationCharacter;
      operationDisplay.style.display = 'block';
    }

    if ( input.match(number) ) {

      // if number starts with zero, then dot or operator must follow it
      if ( displayValue.charAt(0) === '0' &&
           input !== '.' &&
           displayValue.charAt(1) !== '.' &&
           operations.indexOf(displayValue.charAt(1)) === -1 ) return;

      // no more than 14 characters
      if ( displayValue.length >= 14 ) return;

      // no multiple dots allowed in numbers
      if ( input === '.' ) {
        i = displayValue.length - 1;
        while ( displayValue.charAt(i).match(number) ) {
          if ( displayValue.charAt(i) === '.' ) return;
          i--;
        }
      }

      if ( displayValue && operator ) {
        display.value = displayValue + operator + input;
        operator = '';
      } else {
        display.value = displayValue + input;
      }

    }

    if ( input === '=' ) {
      if ( !displayValue ) return;
      displayValue = eval(displayValue);
      display.value = displayValue;
      operator = '';
      operationDisplay.style.display = 'none';
    }

  }

}
