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


  // function that does the reading, calculations, and updates of the display
  // parameter 'element' is provided from clicking on the button while 'input' and 'id' from pressing a button
  function action() {
    var input = this.value,
        id = this.id,
        displayValue,
        i, len = display.value.length;

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
      display.value = display.value.slice(0, display.value.length - 1);
      if ( !display.value ) {
        operationDisplay.style.display = 'none';
      }
    }

    // this button changes the sign of the current display value
    // it needs better implementation
    // on pressing the 'Enter' key, somehow this code is executed, but it shouldn't.
    // I can't solve this problem
    if ( id === 'plus-minus' && display.value ) {
      if ( display.value.charAt(len - 1) !== '*' && display.value.charAt(len - 1) !== '/' && operations.indexOf(display.value.charAt(len - 1)) === -1 ) {
        display.value = eval(display.value) * (-1);
        operator = '';
        operationDisplay.style.display = 'none';
      } else {
        // this enables the change of sign for the number that comes after multiplication or division
        display.value = display.value + '-';
      }
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

    // when the input is a number or a dot or an operator, several rules must be satisfied
    if ( input.match(number) || operator ) {

      // if number starts with zero, then dot or operator must follow it
      if ( display.value.charAt(0) === '0' &&
           len === 1 &&
           input.match(/[0-9]/)
         ) return;

      i = len - 1;
      // don't allow entering numbers if last number was zero and there is an operator in front of it
      if ( input.match(/[0-9]/) &&
           display.value.charAt(i) === '0' &&
           operations.indexOf(display.value.charAt(i - 1)) !== -1
         ) return;

      // no more than 14 characters
      if ( len >= 14 ) return;

      // no multiple dots allowed in numbers
      if ( input === '.' ) {
        // if last input is not an operator, go back character by character while they match a number
        // if the character matches a dot, then do not allow inserting another one
        while ( !operator && display.value.charAt(i).match(number) ) {
          if ( display.value.charAt(i) === '.' ) return;
          i--;
        }
      }

      // no successive operators allowed, if another operator is pressed, then change previous
      if ( operations.indexOf(display.value.charAt(len - 1)) !== -1 && operator ) {
        console.log(display.value.substr(0, len - 1));
        display.value = display.value.substr(0, len - 1) + operator;
        return;
      }

      // finally the input can be displayed in the display
      if ( display.value && operator ) {
        display.value = display.value + operator;
      } else {
        display.value = display.value + input;
      }
      operator = '';
      id = '';

    }

    // this evaluates the expression
    if ( input === '=' ) {
      // don't do anything if the display/expression is empty
      if ( !display.value ) return;

      // if there is something in the display, evaluate it
      display.value = eval(display.value);

      if ( display.value.toString().length >= 12 ) {
        // this prevents displaying large number of decimal places
        // it appears that it also prevents miscalculations that result in things like (0.1 + 0.2 != 0.3 )or (0.3 + 0.6 != 0.9)
        display.value = (display.value * 1).toExponential(4);
      }

      // update the display
      display.value = display.value;
      operationDisplay.style.display = 'none';
      // reset the operator variable
      operator = '';

    }

  }

  window.addEventListener('keydown', function(e) {
    // prevent firefox quick search
    if ( e.key === '/' ) e.preventDefault();
  });

  // keyboard control
  window.addEventListener('keyup', function(e) {
    var keyID = e.key,
        value,
        matched = false;

    // mapping keys to values and IDs for the elements
    switch (keyID) {
      case '/':
        value = '÷';
        matched = true;
        break;
      case '*':
        value = '×';
        matched = true;
        break;
      case 'Enter':
        value = '=';
        matched = true;
        break;
      case 'Backspace':
        value = 'DEL';
        matched = true;
        break;
      case 'Delete':
        value = 'C';
        matched = true;
        break;
      case ('`'):
        value = '±'
        matched = true;
        break;
    }

    if ( !matched ) {
      if ( keyID.match(/[0-9]|\+|-|\./) ) {
        value = keyID;
      } else return;
    }

    var button = document.querySelector('input[value="' + value + '"]');
    // console.log(button);
    button.click();

  });

}
