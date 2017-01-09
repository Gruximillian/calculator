window.addEventListener('load', initCalc);

function initCalc() {
  var numberPattern = /\d|\./, // match valid number characters
      operationPattern = /\+|-|\*|\//, // four arithmetic operations
      number = document.querySelectorAll('.number'), // numbers and a dot
      operation = document.querySelectorAll('.operation'), // operation characters
      control = document.querySelectorAll('.control'), // delete, clear and equal
      signToggle = document.querySelector('#plus-minus'), // changes the sign of the display value
      operationDisplay = document.querySelector('#operation-display'), // element that displays current operation
      calcDisplay = document.querySelector('#display'), // the calculator display element
      i, len, // iteration variables
      operationISymbol = {'*': '×', '/': '÷', '+': '+', '-': '-'}; // html symbols for operations

  // Empty display on reload
  display.value = '';

  function getKeyValue(key) {
    // mapping keys to values and IDs for the elements
    switch (key) {
      case '/':
        return '÷';
      case '*':
        return '×';
      case 'enter':
        return '=';
      case 'backspace':
        return 'DEL';
      case 'delete':
        return 'C';
      default:
        return '';
    }
  }

  function getButton(key) {
    var value,
        button;

    // get proper value for the element
    value = getKeyValue(key);

    // if the pressed key does not match any of the keys we are interested in, then do nothing
    if ( !value ) {
      if ( key.match(/\d|\+|-|\./) ) {
        value = key;
      } else return;
    }

    // select appropriate button and fire a click event on it
    button = document.querySelector('input[value="' + value + '"]');
    return button;
  }

  window.addEventListener('keydown', function(e) {
    var key = e.key.toLowerCase(),
        button = getButton(key); // find to what button the 'key' corresponds

    // if the minus is pressed with the shift key, then highlight the sign toggle instead
    if ( key === '-' && e.shiftKey ) {
      // this class adds highlight on the button when the keyboard is used for input
      signToggle.classList.add('keyboard-active');
      return;
    }

    // prevent firefox quick search
    if ( key === '/' ) e.preventDefault();

    if ( !button ) return;

    // this class adds highlight on the button when the keyboard is used for input
    button.classList.add('keyboard-active');

  });

  // keyboard control
  window.addEventListener('keyup', function(e) {
    var key = e.key.toLowerCase(),
        button = getButton(key); // find to what button the 'key' corresponds

    if ( !button ) return;

    // if the minus is pressed with the shift key, then activate the sign toggle instead
    if ( key === '-' && e.shiftKey ) {
      signToggle.click();
      // this class adds highlight on the button when the keyboard is used for input
      signToggle.classList.remove('keyboard-active');
      return;
    }

    // simulate click on the button
    button.click();
    // after releasing the key, remove the highlight from the button
    button.classList.remove('keyboard-active');

  });

  // control buttons, 'DEL', 'CLEAR' and 'ENTER'
  len = control.length;
  for ( i = 0; i < len; i++) {
    control[i].addEventListener('click', function () {
      var expression = calcDisplay.value,
          control = this.value,
          len = expression.length,
          i = len -1;

      // clears the display, removes operation indicator
      if ( control === 'C' ) {
        calcDisplay.value = '';
        operationDisplay.style.display = 'none';
      }

      // removes last input from the display and the operation display when display is empty
      if ( control === 'DEL' ) {
        calcDisplay.value = expression.substr(0, i);
        if ( !expression ) {
          operationDisplay.style.display = 'none';
        }
      }

      // this evaluates the expression
      if ( control === '=' ) {
        // don't do anything if the display/expression is empty or the last character is not a digit
        if ( !expression || !expression.charAt(i).match(/\d/) ) return;

        // if there is something in the display, evaluate it
        expression = eval(expression);

        if ( expression.toString().length >= 12 ) {
          // this prevents displaying large number of decimal places
          // it appears that it also prevents miscalculations that result in things like (0.1 + 0.2 != 0.3 )or (0.3 + 0.6 != 0.9)
          expression = (expression * 1).toExponential(4);
        }

        // update the display and operation indicator
        calcDisplay.value = expression;
        operationDisplay.style.display = 'none';

      }

    });
  }

  // number elements events
  len = number.length;
  for ( i = 0; i < len; i++ ) {
    number[i].addEventListener('click', function() {
      var expression = calcDisplay.value,
          number = this.value,
          len = expression.length,
          i = len - 1;

      // no more than 14 characters
      if ( len >= 14 ) return;

      // first character may be any number or dot
      if ( !expression ) {
        calcDisplay.value = number;
        return;
      }

      //if number starts with zero, don't allow entering other numbers
      if ( expression.charAt(0) === '0' &&
           len === 1 &&
           number.match(/\d/)
         ) return;

      // don't allow entering numbers if last number was zero and there is an operator in front of it
      if ( number.match(/\d/) &&
           expression.charAt(i) === '0' &&
           expression.charAt(i - 1).match(operationPattern)
       ) return;

      // no multiple dots allowed in numbers
      if ( number === '.' ) {
        // go back character by character while they match a number
        // if the character matches a dot, then do not allow inserting another one
        while ( expression.charAt(i).match(numberPattern) ) {
          if ( expression.charAt(i) === '.' ) return;
          i--;
        }
      }

      calcDisplay.value = expression + number;

    });
  }

  // operation elements events
  len = operation.length;
  for ( i = 0; i < len; i++ ) {
    operation[i].addEventListener('click', function() {
      var expression = calcDisplay.value,
          operation = this.id, // the id holds the proper operation sign
          len = expression.length,
          i = len - 1;

      // no more than 14 characters
      if ( len >= 14 ) return;

      // no operation sign allowed after the dot
      if ( expression.charAt(i) === '.' ) return;

      // of all the operation signs, only minus is allowed to be entered at the start of the expression
      if ( !expression && operation !== '-' ) return;

      // if the expression starts with minus and it is the only character in the expression don't enter operations
      if ( expression.charAt(0) === '-' && len === 1 ) return;

      // if there are already two operators present do not add more
      // this occurs when we are dividing and multiplying with negative numbers
      if ( expression.charAt(i).match(operationPattern) && expression.charAt(i - 1).match(operationPattern) ) return;

      // no successive operators allowed, if another operator is pressed, then change previous
      if ( expression.charAt(i).match(operationPattern) ) {
        // update the display
        calcDisplay.value = expression.substr(0, i) + operation;
        operationDisplay.textContent = operationISymbol[operation];
        operationDisplay.style.display = 'block';
        return;
      }

      // update the display
      calcDisplay.value = expression + operation;
      operationDisplay.textContent = operationISymbol[operation];
      operationDisplay.style.display = 'block';

    });
  }

  // event for key that changes the sign of the expression or of the number
  signToggle.addEventListener('click', function() {
    var expression = calcDisplay.value,
        len = expression.length,
        i = len - 1;

    // if the last character in the expression is a digit, then evaluate expression and change its sign
    if ( expression.charAt(i).match(/\d/) ) {
      calcDisplay.value = eval(expression) * (-1);
      operationDisplay.textContent = '';
      operationDisplay.style.display = 'none';
      return;
    }

    // no empty expression allowed and no minus sign allowed after a dot
    if ( !expression || expression.charAt(i) === '.' ) return;

    // if a minus is only character in the expression remove it
    if ( expression.charAt(0) === '-' && len === 1 ) {
      // remove minus
      calcDisplay.value = '';
      operationDisplay.textContent = '';
      operationDisplay.style.display = 'none';
      return;
    }

    // these are the cases when we want to make the number negative or back to positive
    // if the re is already a sign, then according to it either change it or add minus
    // minus is added only after '*' and '/', otherwise, the sign is changed
    if ( !expression.charAt(i - 1).match(operationPattern) ) {
      if ( expression.charAt(i) === '-' ) {
        // change minus into plus
        calcDisplay.value = expression.substr(0, i) + '+';
        operationDisplay.textContent = '+';
        return;
      } else if ( expression.charAt(i) === '+' ) {
        // change plus into minus
        calcDisplay.value = expression.substr(0, i) + '-';
        operationDisplay.textContent = '-';
        return;
      } else {
        // add minus
        calcDisplay.value = expression + '-';
        return;
      }
    } else {
      // if we have two operation signs, then it is the combination '*-' or '/-'
      // so, we will remove minus from the expression
      if ( expression.charAt(i) === '-' ) {
        // remove minus
        calcDisplay.value = expression.substr(0, i);
        return;
      }
    };

  });

}
