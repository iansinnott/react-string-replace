import test from 'ava';
import replaceString from './';

test('Throws if not given a non-empty string', t => {
  t.throws(() => replaceString());
  t.throws(() => replaceString(''));
});

test('Returns an array', t => {
  t.true(Array.isArray(replaceString('blah', 'blah', x => x)));
});

test('Works with matching groups', t => {
  t.same(
    replaceString('hey there', /(hey)/g, x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there']
  );
});

test('Works with strings', t => {
  t.same(
    replaceString('hey there', 'hey', x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there']
  );
});

test('Works with arrays', t => {
  const input = ['hey there', { value: 'you' }, 'again'];
  t.same(
    replaceString(input, 'hey', x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there', { value: 'you' }, 'again']
  );
});

test('Successfully escapes parens in strings', t => {
  t.same(
    replaceString('(hey) there', '(hey)', x => ({ worked: x })),
    ['', { worked: '(hey)' }, ' there']
  );

  t.same(
    replaceString('hey ((y)(you)) there', '((y)(you))', x => ({ worked: x })),
    ['hey ', { worked: '((y)(you))' }, ' there']
  );
});

test('Can be called consecutively on returned result of previous call', t => {
  const originalTweet = 'Hey @iansinnott, check out this link https://github.com/iansinnott/ Hope to see you at #reactconf';
  let reactReplacedTweet;

  // Match URLs
  reactReplacedTweet = replaceString(originalTweet, /(https?:\/\/\S+)/g, match => (
    { type: 'url', value: match }
  ));

  t.same(reactReplacedTweet, [
    'Hey @iansinnott, check out this link ',
    { type: 'url', value: 'https://github.com/iansinnott/' },
    ' Hope to see you at #reactconf',
  ]);

  // Match @-mentions
  reactReplacedTweet = replaceString(reactReplacedTweet, /(@\w+)/g, match => (
    { type: 'mention', value: match }
  ));

  t.same(reactReplacedTweet, [
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

  t.same(reactReplacedTweet, [
    'Hey ',
    { type: 'mention', value: '@iansinnott' },
    ', check out this link ',
    { type: 'url', value: 'https://github.com/iansinnott/' },
    ' Hope to see you at ',
    { type: 'hashtag', value: '#reactconf' },
    '',
  ]);
});
