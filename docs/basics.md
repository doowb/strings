Main **Strings** concepts:

* [prop-strings](#prop-strings)
* [parsers](#parsers)
* [context](#context)


### prop-strings

A prop-string, or `propstring`, is a sort of template with one or more delimiters denoting the strings that will replaced with actual values.

Example prop-string:

```js
:a/:b/:c
```

### context

The data that will be used to replace properties in the prop-strings.

Example context:

```js
{
  a: 'aaa',
  b: 'bbb',
  c: 'ccc'
}
```

If used to replace the prop-strings in the previous section, the result would be:

```js
aaa/bbb/ccc
```

### parsers

By default, Strings will parse and replace the values in the previous examples with no problem. Parsers are used to tell Strings how to process patterns that it can't natively.

Example:

```js
// replace all occurrences of `a` with `b`
strings.parser('a', {pattern: /a/g, replacement: 'b'});
```