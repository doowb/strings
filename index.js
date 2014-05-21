/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var frep = require('frep');
var _ = require('lodash');
var utils = require('./lib/utils.js');


/**
 * Strings constructor method
 *
 * @return {Object} Instance of a Strings object
 */

function Strings(context) {
  if (!(this instanceof Strings)) {
    return new Strings(context);
  }
  this._context = context || {};
  this._replacements = {};
  this._propstrings = {};
  this._patterns = {};
  this._parsers = {};
  this._groups = {};
}


/**
 * .propstring (name, propstring)
 *
 * Get or set a propstring.
 *
 * @param {String} `name`
 * @param {String} `propstring`
 * @return {Object} Instance of the current Strings object
 * @api public
 */

Strings.prototype.propstring = function (name, template) {
  if (_.isUndefined(template)) {
    return this._propstrings[name];
  }
  this._propstrings[name] = template;
  return this;
};


/**
 * .pattern (name, pattern)
 *
 * Get or set regular expression or string.
 *
 * @param {String} `name`
 * @param {String} `pattern`
 * @return {Object} Instance of the current Strings object
 * @api public
 */

Strings.prototype.pattern = function (name, pattern, flags) {
  if (_.isUndefined(pattern)) {
    return this._patterns[name];
  }
  if (!(pattern instanceof RegExp)) {
    pattern = new RegExp(pattern, flags || '');
  }
  this._patterns[name] = pattern;
  return this;
};


/**
 * .replacement (name, replacement)
 *
 * Get or set a replacement string or function.
 *
 * @param {String} `name`
 * @param {String} `replacement`
 * @return {Object} Instance of the current Strings object
 * @api public
 */

Strings.prototype.replacement = function (name, replacement) {
  if (_.isUndefined(replacement)) {
    return this._replacements[name];
  }
  this._replacements[name] = replacement;
  return this;
};


/**
 * .parser (name, replacements)
 *
 * Define a named parser to be used against any given propstring.
 *
 * @param {String} `name` name of the parser.
 * @param {Object|Array} `replacements` replacements patterns to store with the given name.
 * @return {Object} Instance of the current Strings object
 *
 * @api public
 */

Strings.prototype.parser = function (name, replacements) {
  if (_.isUndefined(replacements)) {
    return this._parsers[name];
  }
  this._parsers[name] = replacements;
  return this;
};


/**
 * .parsers (parsers)
 *
 * Return a list of parsers based on the given list of named parsers or parser objects.
 *
 * @param {String|Array} `parsers` named parsers or parser objects to use.
 * @return {Array}
 */

Strings.prototype.parsers = function (parsers) {

  // if there are no parsers specified, return them all
  if (_.isEmpty(parsers)) {
    parsers = _.keys(this._parsers);
  }

  parsers = Array.isArray(parsers) ? parsers : [parsers];

  // find the specified parsers
  var _parsers = _.map(parsers, function (parser) {
    // if this is an actual parser object, just return it
    if (_.isObject(parser)) {
      return parser;
    }

    // find the parser and return it
    if (this._parsers.hasOwnProperty(parser)) {
      return this._parsers[parser];
    }
  }, this);

  // finally normalize and return parsers
  return utils._normalize(_.flatten(_parsers));
};


/**
 * .template (template, parsers, context)
 *
 * Directly process the given propstring using a string, object or array of replacement patterns using the given context.
 *
 * @param {String} `template` template to process
 * @param {String|Object|Array} `parsers` named parsers or parser objects to use when processing.
 * @param {Object} `context` context to use. optional if a global context is passed.
 * @return {String} Processed string
 * @api public
 */

Strings.prototype.template = function (template, parsers, context) {
  var _parsers = this.parsers(parsers);
  var ctx = utils._bind(_parsers, _.extend({}, this._context, context));
  return frep.strWithArr(template, ctx);
};


/**
 * .process(propstring, parsers, context)
 *
 * Process the given propstring using a named collection of replacement patterns, and a context.
 *
 * @param {String} `propstring` Named template used for building the final string
 * @param {String} `name` Name of replacement group to use for building the final string
 * @param {Object} `context` Optional Object to bind to replacement function as `this`
 * @return {String} Final string built from the given propstring, named replacement collection and context
 * @api public
 */

Strings.prototype.process = function (propstring, parsers, context) {
  return this.template(this.propstring(propstring), parsers, context);
};


/**
 * .group (name, propstring, parsers)
 *
 * Define a named group of propstring/parser mappings.
 *
 * @param {String} `name`
 * @param {String} `propstring` the name of the propstring to use
 * @param {String|Array} `parsers` name or array of names of parsers to use
 * @return {Object} Instance of the current Strings object
 * @api public
 */

Strings.prototype.group = function (name, propstring, parsers) {
  if (_.isUndefined(propstring) && _.isUndefined(parsers)) {
    return this._groups[name];
  }
  this._groups[name] = {
    propstring: propstring,
    parsers: parsers
  };
  return this;
};


/**
 * .run (group, context)
 *
 * Process the propstring from the given group using a named collection of replacement patterns, and a context.
 *
 * @param {String} `group` Named group used for building the final string
 * @param {Object} `context` Optional Object to bind to replacement function as `this`
 * @return {String} Final string built from the given propstring, named replacement collection and context
 * @api public
 */

Strings.prototype.run = function (group, context) {
  var _group = this.group(group);
  return this.process(_group.propstring, _group.parsers, context);
};


module.exports = Strings;
