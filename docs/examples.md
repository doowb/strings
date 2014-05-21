### path parser

You could for instance create a parser for the node.js path module so that prop-strings like `:dirname/:basename:extname` can be parsed and replaced with real values:

For example:

```js
var path = require('path');
var context = {src: 'foo/bar/baz.html'};

// `this` refers to the given context
strings.parser('dirname', {
  pattern: ':dirname',
  replacement: function () {
    return path.dirname(this.src);
  },
  pattern: ':basename',
  replacement: function () {
    return path.basename(this.src, path.extname(this.src));
  },
  pattern: ':extname',
  replacement: function () {
    return path.extname(this.src);
  }
});
```
