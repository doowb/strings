
var frep = require('frep');
var _ = require('lodash');

var utils = require('./utils.js');

/**
 * Strings
 *
 * Strings constructor method
 *
 * @return {Object} Instance of a Strings object
 */

var Strings = function (context) {
  if (!(this instanceof Strings)) {
    return new Strings(context);
  }
  this._context = context || {};
  this._replacements = {};
};


/**
 * set
 *
 * Set a named group of replacement patterns
 *
 * @param {String}       name         - Name of the replacements group.
 * @param {Object|Array} replacements - Actual replacement group to set.
 * @return {Object} Instance of the current Strings object
 */

Strings.prototype.set = function (name, replacements) {
  this._replacements[name] = replacements;
  return this;
};


/**
 * get
 *
 * Get a named group of normalized replacement patterns
 *
 * @param {String} name - Name of the replacement group.
 * @return {Array} Normailzed array of replacement patterns
 */

Strings.prototype.get = function (name) {
  if (name in this._replacements) {
    return utils.normalize(this._replacements[name]);
  }
  return null;
};


/**
 * getRaw
 *
 * Get a named group of replacement patterns in the same
 * for that it was set.
 *
 * @param {String} name - Name of the replacement group.
 * @return {Object|Array} Same Object or Array that was passed into `set`
 */

Strings.prototype.getRaw = function (name) {
  return this._replacements[name];
};


/**
 * replacements
 *
 * Get all normalized groups of replacement patterns.
 *
 * @return {Array} Concatinated Array of all normailzed replacement groups.
 */

Strings.prototype.replacements = function () {
  var arr = [];
  _.forOwn(this._replacements, function (value) {
    arr = arr.concat(utils.normalize(value));
  });
  return arr;
};


/**
 * process
 *
 * Process a given structure using the name group
 * of replacement patterns
 *
 * @param {String} structure - Prop string strucuture used for building the final string.
 * @param {String} name - Name of replacement group to use for building the final string.
 * @param {Object} context - Optional Object to bind to replacment function as `this`.
 * @return {String} Final string built from structure, named replacement group and option context.
 */

Strings.prototype.process = function (structure, name, context) {
  if (name && _.isObject(name)) {
    context = name;
    name = null;
  }
  var replacements = this.get(name) || this.replacements();
  return frep.strWithArr(structure, utils.bind(replacements, _.extend({}, this._context, context)));
};

module.exports = Strings;
