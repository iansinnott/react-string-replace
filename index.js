/* eslint-disable vars-on-top, no-var, prefer-template */
var isRegExp = require('lodash.isregexp');
var escapeRegExp = require('lodash.escaperegexp');
var isString = require('lodash.isstring');
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
  var curCharStart = 0;
  var curCharLen = 0;

  if (str === '') {
    return str;
  } else if (!str || !isString(str)) {
    throw new TypeError(
      'First argument to react-string-replace#replaceString must be a string',
    );
  }

  if (!Array.isArray(match)) {
    match = [match];
  }

  function replace(string, matchArray, _fn) {
    var re = matchArray[0];

    if (!isRegExp(re)) {
      re = new RegExp('(' + escapeRegExp(re) + ')', 'gi');
    }

    var result = string.split(re);

    // Apply fn to all odd elements
    for (var i = 1, length = result.length; i < length; i += 2) {
      curCharLen = result[i].length;
      curCharStart += result[i - 1].length;
      result[i] = _fn(result[i], i, curCharStart);
      curCharStart += curCharLen;
    }

    if (matchArray.length > 1) {
      // Check each remaining part again with fewer matches
      for (var k = 0; k < result.length; k += 2) {
        result[k] = flatten(replace(result[k], matchArray.slice(1), _fn));
      }
    }

    return result;
  }

  return replace(str, match, fn);
}

module.exports = function reactStringReplace(source, match, fn) {
  if (!Array.isArray(source)) source = [source];

  return flatten(
    source.map(function(x) {
      return isString(x) ? replaceString(x, match, fn) : x;
    }),
  );
};
