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
  t.deepEqual(
    replaceString('hey there', /(hey)/g, x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there']
  );
});

test('Works with strings', t => {
  t.deepEqual(
    replaceString('hey there', 'hey', x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there']
  );
});

test('Works with arrays', t => {
  const input = ['hey there', { value: 'you' }, 'again'];
  t.deepEqual(
    replaceString(input, 'hey', x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there', { value: 'you' }, 'again']
  );
});

test('Successfully escapes parens in strings', t => {
  t.deepEqual(
    replaceString('(hey) there', '(hey)', x => ({ worked: x })),
    ['', { worked: '(hey)' }, ' there']
  );

  t.deepEqual(
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

  t.deepEqual(reactReplacedTweet, [
    'Hey @iansinnott, check out this link ',
    { type: 'url', value: 'https://github.com/iansinnott/' },
    ' Hope to see you at #reactconf',
  ]);

  // Match @-mentions
  reactReplacedTweet = replaceString(reactReplacedTweet, /(@\w+)/g, match => (
    { type: 'mention', value: match }
  ));

  t.deepEqual(reactReplacedTweet, [
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

  t.deepEqual(reactReplacedTweet, [
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
test('Allows empty strings within results', t => {
  let replacedContent;
  const string = '@username http://a_photo.jpg';

  replacedContent = replaceString(string, /(http?:\/\/.*\.(?:png|jpg))/g, match => {
    return { key: 'image', match };
  });

  t.deepEqual(replacedContent, [
    '@username ',
    { key: 'image', match: 'http://a_photo.jpg' },
    '',
  ]);

  replacedContent = replaceString(replacedContent, /@(\w+)/g, match => {
    return { key: 'text', match };
  });

  t.deepEqual(replacedContent, [
    '',
    { key: 'text', match: 'username' },
    ' ',
    { key: 'image', match: 'http://a_photo.jpg' },
    '',
  ]);
});
