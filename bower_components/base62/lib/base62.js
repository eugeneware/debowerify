/*!
 * @license base62.js Copyright(c) 2012 sasa+1
 * https://github.com/sasaplus1/base62.js
 * Released under the MIT license.
 */


/**
 * main function.
 *
 * @param {*} global global object.
 */
(function(global) {

  /**
   * fallback Number#isInteger.
   *
   * @param {*} value target value.
   * @return {Boolean} true if value is integer.
   */
  var isInteger = Number.isInteger || function(value) {
    return (typeof value === 'number' && isFinite(value) &&
        value === Math.floor(value));
  };

  /**
   * create Base62 instance.
   *
   * @param {String} table table string.
   * @return {Base62} Base62 instance.
   */
  function createConverter(table) {
    var base62;

    if (arguments.length <= 0) {
      base62 = new Base62;
    } else {
      base62 = new Base62(table);
    }

    base62.createConverter = createConverter;

    return base62;
  }

  /**
   * Base62 encode/decode class.
   *
   * @constructor
   * @param {String} table table string.
   * @throws {TypeError} table is not a string.
   * @throws {Error} table is not 62 length.
   */
  function Base62(table) {
    var tableType;

    // parameter is not set
    if (arguments.length <= 0) {
      table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if ((tableType = typeof table) !== 'string') {
      throw new TypeError('parameter should be a string: ' + tableType);
    } else if (table.length !== 62) {
      throw new Error('parameter should be 62 chars');
    }

    this.table_ = table;
  }

  /**
   * decode from base62 string to number.
   *
   * @param {String} str base62 string.
   * @throws {TypeError} str is not a string.
   * @throws {Error} str is unsupported format.
   * @return {Number} decoded number.
   */
  Base62.prototype.decode = function(str) {
    var strType = typeof str,
        isNegative, table, decodedNum, i, len;

    // type check
    if (strType !== 'string') {
      throw new TypeError('parameter should be a string: ' + strType);
    }

    // syntax check
    if (!/^-?[\da-zA-Z]+$/.test(str)) {
      throw new Error('parameter is unsupported format: ' + str);
    }

    // save negative flag
    isNegative = (str[0] === '-');
    isNegative && (str = str.slice(1));

    table = this.table_;

    // convert
    for (decodedNum = 0, i = len = str.length; i--;) {
      decodedNum += table.indexOf(str[i]) * Math.pow(62, len - i - 1);
    }

    // revert to negative if negative flag
    isNegative && (decodedNum *= -1);

    return decodedNum;
  };

  /**
   * encode from number to base62 string.
   *
   * @param {Number} num integer.
   * @throws {TypeError} num is not a number.
   * @throws {Error} num is not an integer.
   * @return {String} encoded string.
   */
  Base62.prototype.encode = function(num) {
    var numType = typeof num,
        isNegative, table, encodedStr;

    // type check
    if (numType !== 'number') {
      throw new TypeError('parameter should be a number: ' + numType);
    }

    // integer check
    // throw error if parameter is not a finite number
    // or parameter is floating-point number
    if (!isInteger(num)) {
      throw new Error('parameter is not an integer: ' + num);
    }

    if (num === 0) {
      return '0';
    }

    isNegative = (num < 0);
    num = Math.abs(num);

    table = this.table_;

    // convert
    encodedStr = '';
    while (num > 0) {
      encodedStr = table.charAt(num % 62) + encodedStr;
      num = Math.floor(num / 62);
    }

    // revert to negative if negative flag
    isNegative && (encodedStr = '-' + encodedStr);

    return encodedStr;
  };

  // if node.js.
  if (typeof module !== 'undefined') {
    module.exports = createConverter();

    // export private functions if NODE_ENV variable is test.
    if (process.env.NODE_ENV === 'test') {
      module.exports.Base62_ = Base62;
      module.exports.isInteger_ = isInteger;
    }
  } else {
    global.base62 = createConverter();

    // export private functions if declared Mocha.
    if (typeof Mocha !== 'undefined') {
      global.base62.Base62_ = Base62;
      global.base62.isInteger_ = isInteger;
    }
  }

}(this));
