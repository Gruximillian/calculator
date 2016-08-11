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
    buttons[i].addEventListener('click', function () {
      action(this);
    });
  }


  // function that does the reading, calculations, and updates of the display
  function action(element, input, id) {
    var input = input || element.value,
        id = id || element.id,
        displayValue = display.value,
        i, len = displayValue.length;

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
      if ( operator === '*' || operator === '/' ) {
        operationCharacter = input;
      } else {
        operationCharacter = operator;
      }
      operationDisplay.textContent = operationCharacter;
      operationDisplay.style.display = 'block';
    }

    if ( input.match(number) ) {

      // if number starts with zero, then dot or operator must follow it
      if ( displayValue.charAt(0) === '0' &&
           len === 1 &&
           input.match(/[0-9]/)
         ) return;

      i = len - 1;
      // don't allow entering numbers if last number was zero and there is an operator in front of it
      if ( input.match(/[0-9]/) &&
           displayValue.charAt(i) === '0' &&
           operations.indexOf(displayValue.charAt(i - 1)) !== -1
         ) return;

      // no more than 14 characters
      if ( len >= 14 ) return;

      // no multiple dots allowed in numbers
      if ( input === '.' ) {
        // if last input is not an operator, go back character by character while they match a number
        // if the character matches a dot, then do not allow inserting another one
        while ( !operator && displayValue.charAt(i).match(number) ) {
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
      if ( displayValue.toString().length >= 12 ) {
        // this prevents displaying large number of decimal places
        // it appears that it also prevents miscalculations that result in things like (0.1 + 0.2 != 0.3 )or (0.3 + 0.6 != 0.9)
        displayValue = (displayValue * 1).toExponential(4);
      }
      display.value = displayValue;
      operator = '';
      operationDisplay.style.display = 'none';
    }

  }

  window.addEventListener('keypress', function(e) {
    var keyID = e.key,
        value;

    // mapping keys to values and IDs for the elements
    switch (keyID) {
      case '/':
        // prevent firefox quick search
        e.preventDefault();
        value = '÷';
        break;
      case '*':
        value = '×';
        break;
      case 'Enter':
        value = '=';
        break;
      case 'Backspace':
        value = 'DEL';
        break;
      case 'Delete':
        value = 'C';
        break;
      default:
        value = keyID;
        break;
    }

    action(null, value, keyID);

  });

}
