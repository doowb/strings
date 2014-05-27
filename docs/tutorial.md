### Tutorial: Permalinks

> This example makes use of `strings.parser()` and `strings.process()` to dynamically generate permalinks from local file paths.

Before we get started, it's important to note that although we're going to use three different methods to accomplish our goal, `.propstring()`, `.parser()`, and `.template()`, we can accomplish the same thing with one method: `.process()`. But, the point of this tutorial is to demonstrate how to create reusable templates and parsers, and as a result you'll learn how `.process()` works along the way.

Now, on to the subject of this tutorial!

### The goal

> Dynamically create destination paths suitable for permalinks using information from source paths and a few options.

let's say you want to take filepaths from a source directory, such as `templates/*.hbs`, and transform them to a certain pattern in the destination directory, like `:destbase/:dirname/:basename.html`. Each of the `:props` in the propstring will need to be matched up with an actual value at some point. So to accomplish this, we'll need to get the `dirname` and `basename` from our source paths using the Node.js path module, and since `destbase` isn't something we can derive using `path`, we'll need to define that value and pass it in on the "context".

In parts, here is how we will accomplish this with Strings:

1. Define a `propstring`, which is our _template_ for the destination directory: `:destbase/:dirname/:basename/index.html`
1. Define a `parser`, which is how we'll _break apart_ our source file paths, so we can match up the path segments with the _properties_ in our prop string.
1. Define a `context`, which is what Strings will use to replace the `:props` with real values.
1. Pass a file path to `strings.process()`, so that it can construct our actual destination paths using the `context` we provide.


_**Let's get started!**_


### 1. propstring( name, string )

Define the **propstring** that represents the pattern that the destination path should follow. Name it something that semantically describes the purpose, such as `pretty` for "pretty links", since we'll be using this to generate permalinks.

```js
strings.propstring('pretty', ':destbase/:dirname/:basename/index.html');
```

Next we'll define a parser, enabling Strings to know how to apply the values (we'll provide later) to the `propstring` we just defined.


### 2. parser( name, patterns )

For our parser, we'll use the native methods of the Node.js path module to break the path into segments. Also, we'll name the parser `permalink` so that it can easily be matched up with the `permalink` propstring later:

```js
var path = require('path');

strings.parser('pretty', [
  {
    pattern: ':dirname',
    replacement: function () {
      return path.dirname(this.src);
    }
  },
  {
    pattern: ':basename',
    replacement: function () {
      return path.basename(this.src, path.extname(this.src));
    },
  },
  {
    pattern: ':extname',
    replacement: function () {
      return path.extname(this.src);
    }
  }
]);
```

_(Note: `this`, as used above, refers to the given context, which we'll define next.)_


### 3. template( name, string, parser )

Remember, as mentioned at the beginning of the tutorial, defining a `template` isn't 100% necessary, but it makes our parsers and patterns reusable. To save a template:

1. name it
1. specify the name of the `propstring` to associate with it
1. specify the name of the `parsers` to associate with it

```js
strings.template('permalink', {
  propstring: 'pretty',
  parsers: ['path']
});
```

### 4. use( template, context )

Last, build up the context object that will be used by the parser. The context should look like this when it's passed to `strings.template()`:


```js
var context = {src: 'foo/bar/baz.html'};
```

Most likely you will need to do this on an array of filepaths, so if we write a function to do this dynamically it might look something like this:

```js
var glob = require('globule');
var files = glob.find('templates/*.hbs');

files.forEach(function(filepath) {
  strings.use('permalink', context);
});
```

And that's it!

As always, please [report any errors](https://github.com/assemble/strings), thanks!