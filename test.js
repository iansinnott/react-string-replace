import test from 'ava';
import replaceString from './';

test('Throws if not given a non-empty string', t => {
  t.throws(() => replaceString());
  t.throws(() => replaceString(''));
});

test('Returns an array', t => {
  t.true(Array.isArray(replaceString('blah', 'blah', x => x)));
});

test('Works with strings', t => {
  t.same(
    replaceString('hey there', 'hey', x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there']
  );
});

test('Works with matching groups', t => {
  t.same(
    replaceString('hey there', /(hey)/g, x => ({ worked: x })),
    ['', { worked: 'hey' }, ' there']
  );
});
