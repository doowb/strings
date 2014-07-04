# strings [![NPM version](https://badge.fury.io/js/strings.png)](http://badge.fury.io/js/strings)

> Easily replace and transform :props in strings.

Strings is the result of many hours on [screenhero](http://screenhero.com/) and a truly collaborative effort between [Brian Woodward](https://github.com/doowb) and [Jon Schlinkert](https://github.com/jonschlinkert).

Please [report any bugs or feature requests](https://github.com/assemble/strings/issues/new), thanks!

## Install

### [npm](npmjs.org)

```bash
npm install strings --save
```

### [bower](https://github.com/bower/bower)

```bash
bower install strings --save
```

## API
### Strings

> Strings constructor method

Create a new instance of `Strings`, optionally passing a default context to use.

**Example**

```js
var strings = new Strings({destbase: '_gh_pages/'});
```
 
* `return` {Object} Instance of a Strings object 


### .propstring

Set or get a named propstring.

```js
strings.propstring(name, propstring)
```

**Example**

```js
strings.propstring('url', ':base/blog/posts/:basename:ext');
```

* `name` {String} 
* `propstring` {String}  
* `return` {Strings} to allow chaining 


### .pattern

Set or get a string or regex pattern to be used for matching.

```js
strings.pattern(name, pattern, flags);
```

**Example**

```js
strings.pattern('anyProp', ':([\\w]+)');
```

* `name` {String}: The name of the stored pattern. 
* `pattern` {String|RegExp|Function}: The pattern to use for matching. 
* `flags` {String}: Optionally pass RegExp flags to use.  
* `return` {Strings} to allow chaining 


### .source

Return the RegExp source from a stored `pattern`.

```js
strings.source(name);
```

**Example**

```js
strings.pattern('foo', {re: /:([\\w]+)/gm});
strings.source('foo');
//=> ':([\\w]+)'
```

* `name` {String}: The name of the stored pattern.   


### .replacement

Set or get a replacement pattern. Replacement patterns can be a
regular expression, string or function.

```js
strings.replacement(name, replacement)
```

**Example**

```js
strings.replacement('prop', function(match) {
  return match.toUpperCase();
});
```

* `name` {String} 
* `replacement` {String|Function}: The replacement to use when patterns are matched.  
* `return` {Strings} to allow chaining 


### .parser

Set a parser that can later be used to parse any given string.

```js
strings.parser (name, replacements)
```

**Example**

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

* `name` {String} 
* `arr` {Object|Array}: Object or array of replacement patterns to associate.  
* `return` {Strings} to allow chaining 


### .parsers

Get an array of stored parsers by passing a parser name or array of parser names.

```js
strings.parsers(array)
```

**Example**

```js
// pass an array of parser names
strings.parsers(['a', 'b', 'c']);

// or a string
strings.parsers('a');
```


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

* `parsers` {String|Array}: string or array of parsers to get.  
* `return` {Array} 


### .extendParser

Extend a parser with additional replacement patterns. Useful if you're using
an external module for replacement patterns and you need to extend it.

```js
strings.extendParser(parser, replacements)
```

**Example**

```js
strings.extendParser('prop', {
  pattern: /:([\\w]+)/,
  replacement: function(str) {
    return str.toUpperCase();
  }
);
```

* `name` {String}: name of the parser to extend. 
* `arr` {Object|Array}: array of replacement patterns to store with the given name. 
* `pattern` {String|RegExp} 
* `replacement` {String|Function}  
* `return` {Strings} to allow chaining 


### .template

Set or get a reusable Strings template, consisting of a propstring
and an array of parsers.

Templates are useful since they can be stored and then later used
with any context.

```js
strings.template(name, propstring, parsers);
```

**Example**

```js
strings.template('abc', ':a/:b/:c', ['a', 'b', 'c']);
// or use a named propstring
strings.template('abc', 'foo', ['a', 'b', 'c']);
                     here ^
```

* `name` {String} 
* `propstring` {String} 
* `parsers` {Array}: Names of the parsers to use with the template.  
* `return` {Strings} to allow chaining 


### .replace

Replace `:propstrings` with the real values.

```js
strings.replace(str, context)
```

**Example**

```js
strings.replace(':a/:b/:c', {
  a: 'foo',
  b: 'bar',
  c: 'baz'
});
//=> foo/bar/baz
```

* `str` {String}: The string with `:propstrings` to replace. 
* `context` {String}: The object with replacement properties.  
* `return` {Strings} to allow chaining 


### .process

Directly process the given prop-string, using a named replacement
pattern or array of named replacement patterns, with the given
context.

```js
strings.process(str, parsers, context)
```

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

* `str` {String}: the string to process 
* `parsers` {String|Object|Array}: named parsers or parser objects to use when processing. 
* `context` {Object}: context to use. optional if a global context is passed.  
* `return` {String} 


### .run

Process a template with the given context.

```js
strings.run(template, context)
```

**Example**

```js
strings.run('blogTemplate', {
  dest: '_gh_pages',
  basename: '2014-07-01-post',
  ext: '.html'
});
```

* `template` {String}: The template to process. 
* `context` {Object}: Optional context object, to bind to replacement function as `this`  
* `return` {String}


## Authors
 
**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 
 
**Brian Woodward**
 
+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb) 


## License
Copyright (c) 2014 Brian Woodward, contributors.  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on July 03, 2014._