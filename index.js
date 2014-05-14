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
 * .set (name, replacements)
 *
 * Set a named collection of replacement patterns
 *
 * @param {String}       name         - Name of the replacements group.
 * @param {Object|Array} replacements - Actual replacement group to set.
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


Strings.prototype.structure = function (name, template) {
  if (_.isUndefined(template)) {
    return this._templates[name];
  }
  this._templates[name] = template;
  return this;
};

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
    if (parser in this._parsers) {
      return this._parsers[parser];
    }
  }, this);

  // finally normalize and return parsers
  return utils._normalize(_.flatten(_parsers));
};


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
 * @param {String} `structure` Prop string strucuture used for building the final string
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


Strings.prototype.run = function (group, context) {
  var _group = this.group(group);
  return this.process(_group.structure, _group.parsers, context);
};


module.exports = Strings;
