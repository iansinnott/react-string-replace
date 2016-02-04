# react-string-replace

[![Build Status](https://img.shields.io/circleci/project/iansinnott/react-string-replace.svg)](https://circleci.com/gh/iansinnott/react-string-replace)
[![react-string-replace.js on NPM](https://img.shields.io/npm/v/react-string-replace.svg)](https://www.npmjs.com/package/react-string-replace)

React String Replace

> Aka turn a string into an array <span> tags

## Install

```
$ npm install --save react-string-replace
```


## Usage

### Simple Example

```js
const reactStringReplace = require('react-string-replace')
reactStringReplace('whats your name', 'your', (match, i) => (
  <span>{match}</span>
));
// => [ 'whats ', <span>your</span>, ' name' ]
```

### More realistic example

Highlight all digits within a string by surrounding them in span tags:

```js
reactStringReplace('Apt 111, phone number 5555555555.', /(\d+)/g, (match, i) => (
  <span key={i} style={{ color: 'red' }}>{match}</span>
));
// =>
// [
//   'Apt ',
//   <span style={{ color: 'red' }}>111</span>,
//   ', phone number ',
//   <span style={{ color: 'red' }}>5555555555</span>,
//   '.'
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
        {reactStringReplace(this.props.content, /(\d+)/g, (match, i) => (
          <span key={i} style={{ color: 'red' }}>{match}</span>
        ))}
      </div>
    );
  },
});
```

### Full Example

See the `example/` directory for a runnable example.

## Why?

I wanted an easy way to highlight strings within React **without** breaking React's built in string escaping mechanisms. This meant actual string replacement combined with `dangerouslySetInnerHTML` was out of the question.

## API

### reactStringReplace(string, match, func)

#### string

Type: `string`

The string you would like to do replacement on.

#### match

Type: `regexp|string`

The string or RegExp you would like to replace within `string`. Note that when using a `RegExp` you **MUST** include a matching group.

Example: Replace all occurrences of `'hey'` with `<span>hey</span>`

```js
reactStringReplace('hey hey you', /(hey)/g, () => <span>hey</span>);
```

#### func

Type: `function`

The replacer function to run each time `match` is found. This function will be patched the matching string and an index which can be used for adding keys to replacement components if necessary.

```js
const func = (match, index) => <span key={index}>{match}</span>;
reactStringReplace('hey hey you', /(hey)/g, func);
```

## License

MIT © [Ian Sinnott](https://github.com/iansinnott)
