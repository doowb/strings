Pass an object:

```js
strings.parser('prop', {
  pattern: /:([\\w]+)/,
  replacement: function(match) {
    return match.toUpperCase();
  }
);
```
Or an array

```js
strings.parser('prop', [
  {
    pattern: 'a',
    replacement: 'b'
  },
  {
    pattern: 'c',
    replacement: 'd'
  }
]);
```