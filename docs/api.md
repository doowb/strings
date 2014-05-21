Initialize a new `Strings` object.

```js
var strings = new Strings();
```

Optionally pass a default [context](#context) to use:

```js
var strings = new Strings({dirname: 'foo/bar'});
```

An example use case is dynamically generating dest filepaths from source filepaths, in which case you might have "constants" that shouldn't change regardless of the filepath. like `destBase` or `cwd` etc.


### .propstring( name, propstring )

Store a **named** prop-string:

```js
strings.propstring('foo', ':alpha/:beta/:gamma');
```


### .parser( name, replacements )

Define a named parser to be used against any given prop-string.

Params:

* `name` (`String`): the name of the parser
* `replacements` (`object|array`): the replacement patterns to use, this is the logic for the parser. Replacement patterns consist of the following properties:
  - `pattern` (`regex|string`): the pattern to be replaced
  - `replacement` (`string|function`): the actual replacement to use. This is a string value or function used to replace or tranform the prop-strings. Also, in replacement functions `this` is the given context.


Example:

```js
strings.parser('foo', {
  pattern: /a/g,    // find all occurences of `a`
  replacement: 'b'  // and replace them with `b`
});
```

Or using a function:

```js
strings.parser('foo', {
  pattern: /a/g, // find all occurences of `a`
  replacement: function(match) {
    // and replace them with uppercase `A`
    return match.toUpperCase();
  }
});
```


### .template( propstring, groups, context )

1. process a prop-string, using
1. an object or array of replacement patterns, with
1. context from the given object

```js
strings.template('{foo}/{bar}/{baz}/index.html', ['path'], context);
strings.template('{{foo}}/{{bar}}/{{baz}}/index.html', ['path'], context);
strings.template(':foo/:bar/:baz/index.html', ['path'], context);
strings.template(':foo/:bar/:baz/index.html', [{
  pattern: ':dirname',
  replacement: function () {
    return path.dirname(this.filepath);
  }
}], context);
```

### .process( propstring, parsers, context )

Process the _named_ propstring using a _named_ collection of replacement patterns, and a context.

Params:

* `propstring` {String}: Named template used for building the final string
* `name` {String}: Name of replacement group to use for building the final string
* `context` {Object}: Optional Object to bind to replacment function as `this`

```js
strings.process('foo', 'a', context);
// or
strings.process('foo', ['a', 'b']);
```

### .group( name, propstring, parsers )

Store a named group of propstring/parser mappings.

Params:

* `name` {String} the name of the group to store
* `propstring` {String}: the propstring to use
* `parsers` {String|Array}: name or array of names of parsers to use.

```js
strings.group('mapA', 'foo', ['a', 'b', 'c']);
strings.group('mapB', 'foo', ['d', 'e', 'slugify']);
```

### .run( group, context )

Run the named [group](#group) using the given context.

* `group` {String}: The name of the group to use
* `context` {Object}: Optional Object to bind to replacment function as `this`

```js
strings.run('group-foo', context);
```
