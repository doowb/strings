**Examples:**

Pass a propstring and the parsers to use:

```js
// define some parsers to do simple key-value replacements
strings.parser('a', {'{foo}': 'AAA'});
strings.parser('b', {'{bar}': 'BBB'});
strings.parser('c', {'{baz}': 'CCC'});
console.log(strings.process('{foo}/{bar}/{baz}', ['a', 'b', 'c']));
// => 'AAA/BBB/CCC'
```