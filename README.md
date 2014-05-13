# strings [![NPM version](https://badge.fury.io/js/strings.png)](http://badge.fury.io/js/strings)

> Replace :props in strings.

Please [report any bugs or feature requests](https://github.com/assemble/strings/issues/new), thanks!

## Install
Install with [npm](npmjs.org):

```bash
npm i strings --save
```


### [bower](https://github.com/bower/bower)

```bash
bower install strings --save
```

## Usage

Main concepts:

1. `structures`: a sort of template that tells Strings how to assemble your data into a formatted string.
2. `patterns`: patterns tell Strings how to parse and tokenize structures. Patterns may be simple strings or RegExp.
3. `data`: data source that Strings will use to replace the tokens into the provided structure
4. `replacements`: string or function used to tranform the data

_(TODO)_


## API

Initialize a new `Strings` object.

```js
var strings = new Strings();
```

Optionally pass a default context to use:

```js
var strings = new Strings({cwd: 'templates'});
```


### .template

Define a new strings template.

```js
// permalinks
strings.template('pretty', ':basename/index:ext');
```

### .getTemplate()

Getter method for `.template()`.

```js
strings.getTemplate('pretty');
//=> ':basename/index:ext'
```

### .parser( name, parser )

Define a parser that can be used against any given structures.

Example:

```js
strings.parser('foo', {pattern: /foo/g, replacement: 'bar'});
```

Params:

* `name` (`String`): the name of the parser
* `parser` (`Array`|`Object`): the atual parser to store. This can be an object or array of objects.

Parsers must have a `pattern` property and a `replacement` property:

* `pattern` (`String`|`RegExp`): the pattern to be replaced
* `replacement` (`String`|`Function`): the actual replacement to use.


_Notes: should we allow this: `strings.parser('foo', {/foo/g: 'bar'});`_

### .getParser()

```js
strings.getParser('path');
//=>
```

### .parsers

```js
strings.parsers();
```


### .bar

```js
strings.bar('pretty', {basename: 'foo', ext: '.html'});
//=> 'foo/index.html'
```



### .process

```js
strings.process();
```


## Examples

Replacement pattern for the node.js path module:

```js
strings.parser('dirname', {
  pattern: ':dirname',
  replacement: function () {
    return path.dirname(this.filepath);
  }
});
```




## middleware

_(TODO)_

## Author

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb)


## License
Copyright (c) 2014 Brian Woodward, contributors.  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on May 13, 2014._