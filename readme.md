# React String Replace

[![Build Status](https://img.shields.io/circleci/project/iansinnott/react-string-replace.svg)](https://circleci.com/gh/iansinnott/react-string-replace)
[![react-string-replace.js on NPM](https://img.shields.io/npm/v/react-string-replace.svg)](https://www.npmjs.com/package/react-string-replace)

A simple way to safely do string replacement with React components.
Current version follows the API of: [String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

> Aka turn a string into an array of React components

## Install

```
$ npm install --save react-string-replace
```

## API

### reactStringReplace(text, pattern, replacer)

### Returns
Array of React renderable components.

### text
Type: `(string|array)`

String to replace the patterns within.

**NOTE:** When passed an array this is the same as running the replacement on every string within the array. Any non-string values in the array will be left untouched.

### pattern
Type: `(regex|substr)`

The string or RegExp pattern you would like to replace within `text`. Note that when using a `RegExp` you **MUST** include a matching group.

### replacer
Type: `(function(match, p1, ..., pN, offset, originalText))`

Function that will trigger on each pattern match. The `match` argument is the group of characters matching the whole provided pattern.

The `p1 ... pN` arguments are matches for each provided regex pattern group. 
The `offset` is a start character position of the `match` in original string. 
The `originalText` is our original string. 

## Example 1

Replace all occurrences of `'hey'` with `<span>hey</span>`

```js
const reactStringReplace = require('react-string-replace')
const replacer = (match, part, offset) => <span key={offset}>{match}</span>;
reactStringReplace('hey hey you', /(hey)/g, replacer);
```

## Example 2

```js
const reactStringReplace = require('react-string-replace')
const replacer = (match, part, offset) => <span key={offset}>{match}</span>;
reactStringReplace('hey hey you', /(hey)/g, replacer);
```

## Usage

### Simple Example

```js
const reactStringReplace = require('react-string-replace')
reactStringReplace('whats your name', 'your', (match, part, offset) => (
  <span>{match}</span>
));
// => [ 'whats ', <span>your</span>, ' name' ]
```

### More realistic example

Highlight all digits and URLs within a string by surrounding them in span or anchor tags:

```js
const text = 'Apt 111, phone number 5555555555, web: https://www.replaced.com';

reactStringReplace(, /\s(\d+)|(https?:\/\/\S+)/g, (match, numberPart, urlPart, offset) => (
  urlPart ? (
    <a key={offset} href={urlPart}>{urlPart}</a>
  ) : (
    <span key={offset} style={{ color: 'red' }}>{numberPart}</span>
  )
));
// =>
// [
//   'Apt ',
//   <span style={{ color: 'red' }}>111</span>,
//   ', phone number ',
//   <span style={{ color: 'red' }}>5555555555</span>,
//   ', web: ',
//   <a href='https://www.replaced.com'>https://www.replaced.com</a>  
// ]
```

### Within a React component

```js
const reactStringReplace = require('react-string-replace');

const HighlightNumbers = React.createClass({
  render() {
    const content = 'Hey my number is 555-555-5555.';
    return (
      <div>
        {reactStringReplace(content, /(\d+)/g, (match, part, offset) => (
          <span key={offset} style={{ color: 'red' }}>{match}</span>
        ))}
      </div>
    );
  },
});
```

### Multiple replacements on a single string

You can run multiple replacements on one string by calling the function multiple times on the returned result. For instance, if we want to match URLs, @-mentions and hashtags in a string we could do the following:

```js
const reactStringReplace = require('react-string-replace')

const text = 'Hey @ian_sinn, check out this link https://github.com/iansinnott/ Hope to see you at #reactconf';
let replacedText;

// Match URLs
replacedText = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
  <a key={match + i} href={match}>{match}</a>
));

// Match @-mentions
replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
  <a key={match + i} href={`https://twitter.com/${match}`}>@{match}</a>
));

// Match hashtags
replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
  <a key={match + i} href={`https://twitter.com/hashtag/${match}`}>#{match}</a>
));

// => [
//   'Hey ',
//   <a href='https://twitter.com/ian_sinn'>@ian_sinn</a>
//   ', check out this link ',
//   <a href='https://github.com/iansinnott/'>https://github.com/iansinnott/</a>,
//   '. Hope to see you at ',
//   <a href='https://twitter.com/hashtag/reactconf'>#reactconf</a>,
//   '',
// ];
```

### Full Example

See the [`example/`](https://github.com/iansinnott/react-string-replace/tree/master/example) directory for a runnable example.

## Why?

I wanted an easy way to do string replacement a la `String.prototype.replace` within React components **without** breaking React's built in string escaping functionality. This meant standard string replacement combined with `dangerouslySetInnerHTML` was out of the question.

## API

### reactStringReplace(string, match, func)

#### string

Type: `string|array`

The string or array you would like to do replacement on.

**NOTE:** When passed an array this is the same as running the replacement on every string within the array. Any non-string values in the array will be left untouched.

#### match

Type: `regexp|string`




## License

MIT © [Ian Sinnott](https://github.com/iansinnott)
