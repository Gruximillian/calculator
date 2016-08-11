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
      // when a button is clicked, only its reference is needed as a parameter
      action(this);
    });
  }


  // function that does the reading, calculations, and updates of the display
  // parameter 'element' is provided from clicking on the button while 'input' and 'id' from pressing a button
  function action(element, input, id) {
    var input = input || element.value,
        id = id || element.id,
        displayValue = display.value,
        i, len = displayValue.length;

    console.log('element: ', element);

    // this is the 'Clear' button action
    // clears the display, the expression and the operator
    if ( input === 'C' ) {
      expression = '';
      display.value = '';
      operator = '';
      operationDisplay.style.display = 'none';
    }

    // this is the 'Delete' button action
    // removes last input from the display and the operation display when display is empty
    if ( input === 'DEL' ) {
      display.value = displayValue.slice(0, displayValue.length - 1);
      if ( !display.value ) {
        operationDisplay.style.display = 'none';
      }
    }

    // this button changes the sign of the current display value
    // it needs better implementation
    if ( id === 'plus-minus' && displayValue ) {
      display.value = displayValue * (-1);
      element = null;
    }

    // determining the current operation
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

    // when the input is a number or a dot, several rules must be satisfied
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

      // finally the input can be displayed in the display
      if ( displayValue && operator ) {
        display.value = displayValue + operator + input;
        operator = '';
      } else {
        display.value = displayValue + input;
      }

    }

    // this evaluates the expression
    if ( input === '=' ) {
      // don't do anything if the display/expression is empty
      if ( !displayValue ) return;

      console.log('display.value 1: ', display.value);

      console.log('displayValue 1: ', displayValue);

      // if there is something in the display, evaluate it
      displayValue = eval(display.value);

      if ( displayValue.toString().length >= 12 ) {
        // this prevents displaying large number of decimal places
        // it appears that it also prevents miscalculations that result in things like (0.1 + 0.2 != 0.3 )or (0.3 + 0.6 != 0.9)
        displayValue = (displayValue * 1).toExponential(4);
      }

      console.log('display.value 2: ', display.value);

      console.log('displayValue 2: ', displayValue);

      // update the display
      display.value = displayValue;
      operationDisplay.style.display = 'none';
      // reset the operator variable
      operator = '';

      console.log('display.value 3: ', display.value);

      console.log('displayValue 3: ', displayValue);

    }

  }

  // keyboard control
  window.addEventListener('keydown', function(e) {
    var keyID = e.key,
        value;

    console.log('key: ', keyID);

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

    // PREPARING FOR MAKING A VISUAL EFFECT OF PRESSING A KEY WHEN KEYBOARD IS USED FOR INPUT
    var button = document.querySelector('input[value="' + value + '"]');
    // console.log(button);

    // when keyboard is used for input, we must pass the value and id that we mapped in the switch statement
    action(null, value, keyID);

  });

}
