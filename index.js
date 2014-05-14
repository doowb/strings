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
  this._templates = {};
  this._parsers = {};
  this._groups = {};
}


/**
 * .parser (name, replacements)
 *
 * Define a named parser to be used against any given template.
 *
 * @param {String}       name         - Name of the parser.
 * @param {Object|Array} replacements - Actual parser replacements to store.
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
 * .structure (name, template)
 *
 * A named template to be used for stringifying an object.
 *
 * @param {String} name - Name of the structure
 * @param {String} template - Template string to store
 * @return {Object} Instance of the current Strings object
 *
 * @api public
 */

Strings.prototype.structure = function (name, template) {
  if (_.isUndefined(template)) {
    return this._templates[name];
  }
  this._templates[name] = template;
  return this;
};


/**
 * .group (name, structure, parsers)
 *
 * Named groups of structure/parser mappings to use.
 *
 * @param {String} name - Name of the group
 * @param {String} structure - Name of the named template to use.
 * @param {String|Array} parsers - Named parsers to use.
 * @return {Object} Instance of the current Strings object
 *
 * @api public
 */

Strings.prototype.group = function (name, structure, parsers) {
  if (_.isUndefined(structure) && _.isUndefined(parsers)) {
    return this._groups[name];
  }
  this._groups[name] = {
    structure: structure,
    parsers: parsers
  };
  return this;
};


/**
 * .parsers (parsers)
 *
 * Get a list of parsers based on the list of named parsers or parser objects given.
 *
 * @param {String|Array} parsers - List of named parsers or parser objects to find/use.
 * @return {Array} List of parsers to use.
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
 * Explicit template processed against a string, object or array of replacement patterns using the given context.
 *
 * @param {String} template - Template to process
 * @param {String|Object|Array} parsers- Named parsers or parser objects to use when processing.
 * @param {Object} context - Optional context to use when processing.
 * @return {String} Processed string
 *
 * @api public
 */

Strings.prototype.template = function (template, parsers, context) {
  var _parsers = this.parsers(parsers);
  return frep.strWithArr(template, utils._bind(_parsers, _.extend({}, this._context, context)));
};


/**
 * .process(structure, parsers, context)
 *
 * Process the given structure using a named collection
 * of replacement patterns, and a context.
 *
 * @param {String} `structure` Named template used for building the final string
 * @param {String} `name` Name of replacement group to use for building the final string
 * @param {Object} `context` Optional Object to bind to replacment function as `this`
 *
 * @return {String} Final string built from the given structure, named replacement collection and context
 *
 * @api public
 */

Strings.prototype.process = function (structure, parsers, context) {
  return this.template(this.structure(structure), parsers, context);
};


/**
 * .run (group, context)
 *
 * Process the structure from the given group using a named collection
 * of replacement patterns, and a context.
 *
 * @param {String} `group` Named group used for building the final string
 * @param {Object} `context` Optional Object to bind to replacment function as `this`
 *
 * @return {String} Final string built from the given structure, named replacement collection and context
 *
 * @api public
 */

Strings.prototype.run = function (group, context) {
  var _group = this.group(group);
  return this.process(_group.structure, _group.parsers, context);
};


module.exports = Strings;
