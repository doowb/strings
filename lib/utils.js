/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');


/**
 * Export `utils`
 */

var utils = module.exports = {};


/**
 * ## .arrayify
 *
 * Ensure that values are returned as an array.
 *
 * @param  {Object|Array} `value`
 * @return {Array}
 */

utils.arrayify = function(value) {
  return !Array.isArray(value) ? [value] : value;
};


/**
 * ## ._normalizePatterns
 *
 * Normalize `key: value` replacement patterns into an array
 * of objects with `pattern` and `replacement` keys.
 *
 * **Example**
 *
 * ```js
 * [
 *   {key: value},
 *   {key: value}
 * ]
 * ```
 * converts to:
 *
 * ```js
 * [
 *   { pattern: key, replacement: value },
 *   { pattern: key, replacement: value }
 * ]
 * ```
 *
 * @param  {Object|Array} parsers
 * @return {Object}
 * @api private
 */

utils._normalizePatterns = function (replacementPatterns) {
  var arr = [];
  if (Array.isArray(replacementPatterns)) {
    for (var i = 0; i < replacementPatterns.length; i++) {
      arr = arr.concat(utils._normalizeObj(replacementPatterns[i]));
    }
  } else {
    arr = arr.concat(utils._normalizeObj(replacementPatterns));
  }
  return arr;
};


/**
 * ## ._normalizeObj
 *
 * Normalize the `key: value` pairs in a single replacement
 * pattern object.
 *
 * @param  {Object} `obj`
 * @return {Array}
 */

utils._normalizeObj = function (obj) {
  if (_.isUndefined(obj)) return [];
  if (obj.hasOwnProperty('pattern')
    && obj.hasOwnProperty('replacement')) {
    return [obj];
  }
  var arr = [];
  _.forOwn(obj, function (value, key) {
    arr.push({pattern: key, replacement: value});
  });
  return arr;
};


/**
 * ## ._bind
 *
 * Bind the current `Strings` object, enabling `this` to
 * be used in replacement functions.
 *
 * @param  {Object|Array} `replacements`
 * @param  {Object} `context`
 * @return {Array}
 */

utils._bind = function (replacements, context) {
  replacements = _.cloneDeep(utils.arrayify(replacements));
  context = context || {};

  return _.map(replacements, function (item) {
    if (_.isFunction(item.replacement)) {
      var fn = item.replacement;
      item.replacement = function () {
        return fn.apply(context, arguments);
      };
    }
    return item;
  });
};
