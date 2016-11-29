/* eslint-disable vars-on-top, no-var, prefer-template */
var isRegExp = require('lodash.isregexp');
var escapeRegExp = require('lodash.escaperegexp');
var isString = require('lodash.isstring');
var flatten = require('lodash.flatten');

/**
 * Given a string, replace every substring that is matched by the `pattern` regex
 * with the result of calling `replacer` on matched substring. The result will be an
 * array with all odd indexed elements containing the replacements. The primary
 * use case is similar to using String.prototype.replace except for React.
 *
 * React will happily render an array as children of a react element, which
 * makes this approach very useful for tasks like surrounding certain text
 * within a string with react elements.
 *
 * Example:
 * matchReplace(
 *   'Emphasize all phone numbers like 884-555-4443.',
 *   /([\d|-]+)/g,
 *   (number, part, offset) => <strong key={offset}>{number}</strong>
 * );
 * // => ['Emphasize all phone numbers like ', <strong>884-555-4443</strong>, '.'
 *
 * @param {string} str
 * @param {regexp|substr} pattern Must contain a matching group
 * @param {function|newSubstring} replacer
 * @return {array}
 */
function replaceString(str, pattern, replacer) {
  var prevSegmentStart = 0;

  if (str === '') {
    return str;
  } else if (!str || !isString(str)) {
    throw new TypeError('First argument to react-string-replace#replaceString must be a string');
  }

  var re = pattern;

  if (!isRegExp(re)) {
    re = new RegExp('(' + escapeRegExp(re) + ')', 'gi');
  }

  var result = [];

  str.replace(re, function() {
    var args = Array.prototype.slice.call(arguments);
    var match = args.shift();
    var originalStr = args.pop();
    var offset = args.pop();
    var transformed = (typeof replacer === 'function' ? replacer.apply(null, arguments) : replacer);
    var prevSegment = originalStr.slice(prevSegmentStart, offset);

    result.push(prevSegment, transformed);
    prevSegmentStart += (offset + match.length);
  });

  result.push(str.slice(prevSegmentStart));  
  

  return result;
}

module.exports = function reactStringReplace(source, pattern, replacer) {
  if (!Array.isArray(source)) source = [source];

  return flatten(source.map(function(x) {
    return isString(x) ? replaceString(x, pattern, replacer) : x;
  }));
};
