import { test, expect } from 'bun:test';
import replaceString from './';
import reactStringReplace from '.';

test("Doesn't throw if not given invalid input", () => {
  expect(() => replaceString()).not.toThrow();
  expect(() => replaceString('')).not.toThrow();
});

test('Returns an array', () => {
  expect(Array.isArray(replaceString('blah', 'blah', x => x))).toBe(true);
});

test('Returns correct character offsets', () => {
  const correctOffsets = [6, 17];
  const charOffsets = [];

  replaceString('Hey there, stranger', 'er', (m, i, o) => charOffsets.push(o));
  expect(charOffsets).toEqual(correctOffsets);
});

test('Works with matching groups', () => {
  expect(
    replaceString('hey there', /(hey)/g, x => ({ worked: x }))
  ).toEqual(['', { worked: 'hey' }, ' there']);
});

test('Respects global flag to replace multiple matches', () => {
  const str = 'Hey @ian_sinn and @other_handle, check out this link https://github.com/iansinnott/';
  expect(
    replaceString(str, /@(\w+)/g, x => ({ worked: x }))
  ).toEqual(['Hey ', { worked: 'ian_sinn' }, ' and ', { worked: 'other_handle' }, ', check out this link https://github.com/iansinnott/']);
});

test('Works with strings', () => {
  expect(
    replaceString('hey there', 'hey', x => ({ worked: x }))
  ).toEqual(['', { worked: 'hey' }, ' there']);
});

test('Works with arrays', () => {
  const input = ['hey there', { value: 'you' }, 'again'];
  expect(
    replaceString(input, 'hey', x => ({ worked: x }))
  ).toEqual(['', { worked: 'hey' }, ' there', { value: 'you' }, 'again']);
});

test('Successfully escapes parens in strings', () => {
  expect(
    replaceString('(hey) there', '(hey)', x => ({ worked: x }))
  ).toEqual(['', { worked: '(hey)' }, ' there']);

  expect(
    replaceString('hey ((y)(you)) there', '((y)(you))', x => ({ worked: x }))
  ).toEqual(['hey ', { worked: '((y)(you))' }, ' there']);
});

test('Can be called consecutively on returned result of previous call', () => {
  const originalTweet = 'Hey @iansinnott, check out this link https://github.com/iansinnott/ Hope to see you at #reactconf';
  let reactReplacedTweet;

  // Match URLs
  reactReplacedTweet = replaceString(originalTweet, /(https?:\/\/\S+)/g, match => (
    { type: 'url', value: match }
  ));

  expect(reactReplacedTweet).toEqual([
    'Hey @iansinnott, check out this link ',
    { type: 'url', value: 'https://github.com/iansinnott/' },
    ' Hope to see you at #reactconf',
  ]);

  // Match @-mentions
  reactReplacedTweet = replaceString(reactReplacedTweet, /(@\w+)/g, match => (
    { type: 'mention', value: match }
  ));

  expect(reactReplacedTweet).toEqual([
    'Hey ',
    { type: 'mention', value: '@iansinnott' },
    ', check out this link ',
    { type: 'url', value: 'https://github.com/iansinnott/' },
    ' Hope to see you at #reactconf',
  ]);

  // Match hashtags
  reactReplacedTweet = replaceString(reactReplacedTweet, /(#\w+)/g, match => (
    { type: 'hashtag', value: match }
  ));

  expect(reactReplacedTweet).toEqual([
    'Hey ',
    { type: 'mention', value: '@iansinnott' },
    ', check out this link ',
    { type: 'url', value: 'https://github.com/iansinnott/' },
    ' Hope to see you at ',
    { type: 'hashtag', value: '#reactconf' },
    '',
  ]);
});

/**
 * This was to address #4, where having a match at the end of a string was
 * causing the first replacement to return an array where the last element was
 * ''. This was causing an error where I was checking for !str, even though an
 * empty string should actually be allwed.
 */
test('Allows empty strings within results', () => {
  let replacedContent;
  const string = '@username http://a_photo.jpg';

  replacedContent = replaceString(string, /(http?:\/\/.*\.(?:png|jpg))/g, match => {
    return { key: 'image', match };
  });

  expect(replacedContent).toEqual([
    '@username ',
    { key: 'image', match: 'http://a_photo.jpg' },
    '',
  ]);

  replacedContent = replaceString(replacedContent, /@(\w+)/g, match => {
    return { key: 'text', match };
  });

  expect(replacedContent).toEqual([
    '',
    { key: 'text', match: 'username' },
    ' ',
    { key: 'image', match: 'http://a_photo.jpg' },
    '',
  ]);
});

test('Will not throw if first element of input is empty string', () => {
  const string = 'http://a_photo.jpg some string';
  const replacedContent = replaceString(string, /(http?:\/\/.*\.(?:png|jpg))/g, match => {
    return { key: 'image', match };
  });

  expect(replacedContent).toEqual([
    '',
    { key: 'image', match: 'http://a_photo.jpg' },
    ' some string',
  ]);

  // This replacement would not actually give a new result from above, but it is
  // simply to test that passing in an empty string as the first arg is OK
  expect(() => {
    replaceString(replacedContent, /@(\w+)/g, match => {
      return { key: 'text', match };
    });
  }).not.toThrow();
});

test("Avoids undefined values due to regex", () => {
  const string = `hey you there`;
  const re = /(hey)|(you)/;

  // Normal splits include undefined if you do this
  expect(string.split(re)).toEqual(["", "hey", undefined, " ", undefined, "you", " there"]);

  expect(() => {
    replaceString(string, /(hey)|(you)/, x => x);
  }).not.toThrow();
});

test("Fixed number of string replacements", () => {
  const string = `Test hey test hey test`;
  const replacedContent = reactStringReplace(string, 'hey', match => {
    return 'lo';
  }, 1);
  expect(replacedContent).toEqual([
    'Test ',
    'lo',
    ' test ',
    'hey',
    ' test'
  ]);
});

test("Indexes start at 0 and are contiguous", () => {
  const string = 'Hello there general Kenobi';
  const re = /(\w+)/;

  let expectedIndex = 0;
  replaceString(string, re, (match, index) => {
    expect(index).toEqual(expectedIndex);
    expectedIndex++;
  });
});
