/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var replace = require('frep');
var isObject = require('isobject');
var isEmpty = require('is-empty');
var flatten = require('array-flatten');
var union = require('array-union');
var extend = require('xtend');
var utils = require('./lib/utils');


/**
 * ## Strings
 *
 * > Strings constructor method
 *
 * Create a new instance of `Strings`, optionally passing a default context to use.
 *
 * **Example**
 *
 * ```js
 * var strings = new Strings({destbase: '_gh_pages/'});
 * ```
 *
 * @class `Strings`
 * @constructor
 * @return {Object} Instance of a Strings object
 */

function Strings(context, options) {
  if (!(this instanceof Strings)) {
    return new Strings(context);
  }

  this.options = options || {};
  this.options.nonull = false;

  this.context = context || {};

  this._replacements = {};
  this._propstrings = {};
  this._templates = {};
  this._patterns = {};
  this._parsers = {};
  this._groups = {};
}


/**
 * ## .propstring
 *
 * Set or get a named propstring.
 *
 * ```js
 * strings.propstring(name, propstring)
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.propstring('url', ':base/blog/posts/:basename:ext');
 * ```
 *
 * @param {String} `name`
 * @param {String} `propstring`
 * @return {Strings} to allow chaining
 * @api public
 */

var isPropstring = function(str) {
  return /:/.test(str) ? 'null' : str;
};

Strings.prototype.propstring = function (name, str, options) {
  options = extend({}, this.options, options);

  if (!str) {
    // if `nonull:false` return the propstring or `'__null__'`
    if (options.nonull === false) {
      return this._propstrings[name] || isPropstring(name);
    }
    // if only one argument is passed, lookup the name
    // and return the propstring. Or just return the
    // name if it isn't set already.
    return this._propstrings[name] || name;
  }

  this._propstrings[name] = str;
  return this;
};


/**
 * ## .pattern
 *
 * Set or get a string or regex pattern to be used for matching.
 *
 * ```js
 * strings.pattern(name, pattern, flags);
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.pattern('anyProp', ':([\\w]+)');
 * ```
 *
 * @param {String} `name` The name of the stored pattern.
 * @param {String|RegExp|Function} `pattern` The pattern to use for matching.
 * @param {String} `flags` Optionally pass RegExp flags to use.
 * @return {Strings} to allow chaining
 * @api public
 */

Strings.prototype.pattern = function (name, pattern, flags) {
  if (!pattern) {return this._patterns[name];}
  if (!(pattern instanceof RegExp)) {
    pattern = new RegExp(pattern, flags || '');
  }
  this._patterns[name] = pattern;
  return this;
};


/**
 * ## .replacement
 *
 * Set or get a replacement pattern. Replacement patterns can be a
 * regular expression, string or function.
 *
 * ```js
 * strings.replacement(name, replacement)
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.replacement('prop', function(match) {
 *   return match.toUpperCase();
 * });
 * ```
 *
 * @param {String} `name`
 * @param {String|Function} `replacement` The replacement to use when patterns are matched.
 * @return {Strings} to allow chaining
 * @api public
 */

Strings.prototype.replacement = function (name, replacement) {
  if (!replacement) {return this._replacements[name];}
  this._replacements[name] = replacement;
  return this;
};


/**
 * ## .parser
 *
 * Set a parser that can later be used to parse any given string.
 *
 * ```js
 * strings.parser (name, replacements)
 * ```
 *
 * **Example**
 *
 * {%= docs("example-parser.md") %}
 *
 * @param {String} `name`
 * @param {Object|Array} `arr` Object or array of replacement patterns to associate.
 *   @property {String|RegExp} `pattern`
 *   @property {String|Function} `replacement`
 * @return {Strings} to allow chaining
 * @api public
 */

Strings.prototype.parser = function (name, arr) {
  if (!arr) {return this._parsers[name];}
  this._parsers[name] = utils.arrayify(arr);
  return this;
};


/**
 * ## .parsers
 *
 * Get an array of stored parsers by passing a parser name or array of parser names.
 *
 * ```js
 * strings.parsers(array)
 * ```
 *
 * **Example**
 *
 * ```js
 * // pass an array of parser names
 * strings.parsers(['a', 'b', 'c']);
 *
 * // or a string
 * strings.parsers('a');
 * ```
 *
 * {%= docs("example-parsers.md") %}
 *
 * @param {String|Array} `parsers` string or array of parsers to get.
 * @return {Array}
 * @api public
 */

Strings.prototype.parsers = function (parsers) {
  // if there are no parsers specified, return them all
  if (isEmpty(parsers)) {
    parsers = Object.keys(this._parsers);
  }
  parsers = utils.arrayify(parsers);

  // find the specified parsers
  var arr = flatten(parsers.map(function (parser) {
    // if this is an actual parser object, just return it
    if (isObject(parser)) {
      return parser;
    }
    // find the parser and return it
    if (this._parsers.hasOwnProperty(parser)) {
      return this._parsers[parser];
    }
  }, this));

  // finally normalize and return parsers
  return utils._normalizePatterns(arr);
};


/**
 * ## .extendParser
 *
 * Extend a parser with additional replacement patterns. Useful if you're using
 * an external module for replacement patterns and you need to extend it.
 *
 * ```js
 * strings.extendParser(parser, replacements)
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.extendParser('prop', {
 *   pattern: /:([\\w]+)/,
 *   replacement: function(str) {
 *     return str.toUpperCase();
 *   }
 * );
 * ```
 *
 * @param {String} `name` name of the parser to extend.
 * @param {Object|Array} `arr` array of replacement patterns to store with the given name.
 *   @param {String|RegExp} `pattern`
 *   @param {String|Function} `replacement`
 * @return {Strings} to allow chaining
 * @api public
 */

Strings.prototype.extendParser = function (name, arr) {
  arr = utils.arrayify(arr);
  var parser = union([], this._parsers[name], arr);
  this._parsers[name] = parser;
  return this;
};


/**
 * ## .template
 *
 * Set or get a reusable Strings template, consisting of a propstring
 * and an array of parsers.
 *
 * Templates are useful since they can be stored and then later used
 * with any context.
 *
 * ```js
 * strings.template(name, propstring, parsers);
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.template('abc', ':a/:b/:c', ['a', 'b', 'c']);
 * // or use a named propstring
 * strings.template('abc', 'foo', ['a', 'b', 'c']);
 *                      here ^
 * ```
 *
 * @param {String} `name`
 * @param {String} `propstring`
 * @param {Array} `parsers` Names of the parsers to use with the template.
 * @return {Strings} to allow chaining
 * @api public
 */

Strings.prototype.template = function (name, propstring, parsers) {
  // Get the stored template only the name is passed
  if (arguments.length === 1) {
    return this._templates[name];
  }
  if (arguments.length === 2 && typeof propstring === 'object') {
    var opts = propstring;
    propstring = opts.propstring,
    parsers = opts.parsers
  } else if (arguments.length === 2 && typeof propstring === 'string') {
    throw new Error('Templates must be defined with an object or array of parsers.');
  }
  propstring = this.propstring(propstring);
  this._templates[name] = {propstring: propstring, parsers: parsers};
  return this;
};


/**
 * ## .replace
 *
 * Replace `:propstrings` with the real values.
 *
 * ```js
 * strings.replace(str, context)
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.replace(':a/:b/:c', {
 *   a: 'foo',
 *   b: 'bar',
 *   c: 'baz'
 * });
 * //=> foo/bar/baz
 * ```
 *
 * @param {String} `str` The string with `:propstrings` to replace.
 * @param {String} `context` The object with replacement properties.
 * @return {Strings} to allow chaining
 * @api public
 */

Strings.prototype.replace = function (str, context) {
  var ctx = extend({}, this.context, context);
  return replace.strWithArr(str, utils._bind([
    {
      pattern: /:([\w-]+)/g,
      replacement: function(match, prop) {
        return this[prop] || prop;
      }
    },
    {
      pattern: /\{([^}]+)}/g,
      replacement: function(match, prop) {
        return this[prop] || prop;
      }
    }
  ], ctx));
};


/**
 * ## .process
 *
 * Directly process the given prop-string, using a named replacement
 * pattern or array of named replacement patterns, with the given
 * context.
 *
 * ```js
 * strings.process(str, parsers, context)
 * ```
 *
 * {%= docs("example-process") %}
 *
 * @param {String} `str` the string to process
 * @param {String|Object|Array} `parsers` named parsers or parser objects to use when processing.
 * @param {Object} `context` context to use. optional if a global context is passed.
 * @return {String}
 * @api public
 */

Strings.prototype.process = function (str, arr, context) {
  if (arguments.length === 1) {
    throw new Error('`strings.process()` expects at least two arguments.');
  }

  if (this._templates.hasOwnProperty(str)) {
    context = arr;
    var template = this._templates[str];
    str = template.propstring;
    arr = template.parsers;
  }
  arr = this.parsers(arr);

  var ctx = extend({}, this.context, context);
  return replace.strWithArr(str, utils._bind(arr, ctx));
};


/**
 * ## .run
 *
 * Process a template with the given context.
 *
 * ```js
 * strings.run(template, context)
 * ```
 *
 * **Example**
 *
 * ```js
 * strings.run('blogTemplate', {
 *   dest: '_gh_pages',
 *   basename: '2014-07-01-post',
 *   ext: '.html'
 * });
 * ```
 *
 * @param {String} `template` The template to process.
 * @param {Object} `context` Optional context object, to bind to replacement function as `this`
 * @return {String}
 * @api public
 */

Strings.prototype.run = function (name, context) {
  var template = this._templates[name];
  var propstring = template.propstring;
  var parsers = template.parsers;
  return this.process(propstring, parsers, context);
};


module.exports = Strings;