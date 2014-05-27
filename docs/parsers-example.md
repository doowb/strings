Using `parsers` like this:

```js
strings.parsers([
  'jumbotron',
  'labels',
  'progress',
  'glyphicons',
  'badges',
  'alerts',
  'newlines'
]);
```
is just sugar for:

```js
var parsers = [
  strings.parser('jumbotron'),
  strings.parser('labels'),
  strings.parser('progress'),
  strings.parser('glyphicons'),
  strings.parser('badges'),
  strings.parser('alerts'),
  strings.parser('newlines'),
];
```

For an example, see [markdown-symbols](https://github.com/jonschlinkert/markdown-symbols), which uses this to store replacement patterns for custom markdown symbols.