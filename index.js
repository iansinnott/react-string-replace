/* eslint-disable vars-on-top, no-var, prefer-template */
'use strict';

var isRegExp = require('lodash.isregexp');
var escapeRegExp = require('lodash.escaperegexp');
var isString = require('lodash.isstring');
var isArray = require('lodash.isarray');
var flatten = require('lodash.flatten');

/**
 * Given a string, replace every substring that is matched by the `match` regex
 * with the result of calling `fn` on matched substring. The result will be an
 * array with all odd indexed elements containing the replacements. The primary
 * use case is similar to using String.prototype.replace execpt for React.
 *
 * React will happily render an array as children of a react element, which
 * makes this approach very useful for tasks like surrounding certain text
 * within a string with react elements.
 *
 * Example:
 * matchReplace(
 *   'Emphasize all phone numbers like 884-555-4443.',
 *   /([\d|-]+)/g,
 *   (number, i) => <strong key={i}>{number}</strong>
 * );
 * // => ['Emphasize all phone numbers like ', <strong>884-555-4443</strong>, '.'
 *
 * @param {string} str
 * @param {regexp|str} match Must contain a matching group
 * @param {function} fn
 * @return {array}
 */
function replaceString(str, match, fn) {
  if (str === '') {
    return str;
  } else if (!str || !isString(str)) {
    throw new TypeError('First argument to react-string-replace#replaceString must be a string');
  }

  var re = match;

  if (!isRegExp(re)) {
    re = new RegExp('(' + escapeRegExp(re) + ')', 'gi');
  }

  var result = str.split(re);

  // Apply fn to all odd elements
  for (var i = 1, length = result.length; i < length; i += 2) {
    result[i] = fn(result[i], i);
  }

  return result;
}

module.exports = function reactStringReplace(str, match, fn) {
  if (isString(str)) {
    str = [str];
  }

  if (!isArray(str) || !str[0]) {
    throw new TypeError('First argument to react-string-replace must be an array or non-empty string');
  }

  return flatten(str.map(function(x) {
    return isString(x) ? replaceString(x, match, fn) : x;
  }));
};
