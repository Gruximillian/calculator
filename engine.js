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
        i;

    if ( input === 'C' ) {
      expression = '';
      display.value = '';
      operationDisplay.style.display = 'none';
    }

    if ( input === 'DEL' ) {
      display.value = display.value.slice(0, display.value.length - 1);
      if ( !display.value ) {
        operationDisplay.style.display = 'none';
      }
    }

    if ( id === 'plus-minus' ) {
      display.value = display.value * (-1); // changing the sign
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

      // if number starts with zero, then dot must follow it
      if ( input !== '.' && display.value.charAt(0) === '0' && display.value.charAt(1) !== '.' ) return;

      // no more than 14 characters
      if ( display.value.length >= 14 ) return;

      // no multiple dots allowed in numbers
      if ( input === '.' ) {
        i = display.value.length - 1;
        while ( display.value.charAt(i).match(number) ) {
          if ( display.value.charAt(i) === '.' ) return;
          i--;
        }
      }

      if ( display.value && operator ) {
        display.value = display.value + operator + input;
        operator = '';
      } else {
        display.value = display.value + input;
      }

    }

    if ( input === '=' ) {
      display.value = eval(display.value);
      operationDisplay.style.display = 'none';
    }

  }

}
