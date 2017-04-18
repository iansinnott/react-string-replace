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

  function replace(_str, _match, _fn) {
    var curCharStart = 0;
    var curCharLen = 0;

    var re = _match[0];

    if (!isRegExp(re)) {
      re = new RegExp('(' + escapeRegExp(re) + ')', 'gi');
    }

    var result = _str.split(re);

    // Apply fn to all odd elements
    for (var i = 1, length = result.length; i < length; i += 2) {
      curCharLen = result[i].length;
      curCharStart += result[i - 1].length;
      result[i] = _fn(result[i], i, curCharStart);
      curCharStart += curCharLen;
    }

    if (_match.length > 1) {
      // Run a recursive call of this function on even elements,
      // removing the first element in _match
      for (var j = 0; j < result.length; j += 2) {
        result[j] = flatten(replace(result[j], _match.slice(1), _fn));
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
