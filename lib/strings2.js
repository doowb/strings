/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var frep = require('frep');
var _ = require('lodash');
var utils = require('./lib/utils');


/**
 * Strings constructor method
 *
 * @return {Object} Instance of a Strings object
 */

function Strings() {
  if (!(this instanceof Strings)) {
    return new Strings();
  }
  this._replacements = {};
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

Strings.prototype.set = function (name, replacements) {
  this._replacements[name] = replacements;
  return this;
};


/**
 * .get (name)
 *
 * Get a collection of normalized replacement patterns by name
 *
 * @param {String} `name` Name of the collection to get.
 * @return {Array} Normalized array of replacement patterns.
 *
 * @api public
 */

Strings.prototype.get = function (name) {
  if (name in this._replacements) {
    return utils._normalize(this._replacements[name]);
  }
  return null;
};


/**
 * .getRaw(name)
 *
 * Retrieve the original, non-normalized collection of
 * replacement patterns, by name.
 *
 * @param {String} name - Name of the replacement pattern collection.
 * @return {Object|Array} Original collection that was passed into `set`
 *
 * @api public
 */

Strings.prototype.getRaw = function (name) {
  return this._replacements[name];
};


/**
 * .replacements(value)
 *
 * @return {Array} Normalized array of all replacement patterns.
 *
 * @api public
 */

Strings.prototype.replacements = function () {
  var arr = [];
  _.forOwn(this._replacements, function (value) {
    arr = arr.concat(utils._normalize(value));
  });
  return arr;
};


/**
 * .process(structure, name, context)
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

Strings.prototype.process = function (structure, name, context) {
  if (name && _.isObject(name)) {
    context = name;
    name = null;
  }
  var replacements = this.get(name) || this.replacements();
  return frep.strWithArr(structure, utils._bind(replacements, context));
};

module.exports = Strings;
