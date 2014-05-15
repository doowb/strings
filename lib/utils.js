/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');
var utils = {};


utils._normalize = function (parsers) {
  var arr = [];
  if (Array.isArray(parsers)) {
    // [{key: value}, {key, value}] => [{pattern: key, replacement: value], {pattern:key, replacement: value}]
    var i;
    for (i = 0; i < parsers.length; i++) {
      arr = arr.concat(utils._normalizeObject(parsers[i]));
    }
  } else {
    // {key: value} => [{pattern: key, replacement: value}];
    arr = arr.concat(utils._normalizeObject(parsers));
  }
  return arr;
};


utils._normalizeObject = function (object) {

  if (_.isUndefined(object)) {
    return [];
  }

  if (object.hasOwnProperty('pattern') && object.hasOwnProperty('replacement')) {
    return [object];
  }

  var arr = [];
  _.forOwn(object, function (value, key) {
    arr.push({pattern: key, replacement: value});
  });

  return arr;
};


utils._bind = function (replacements, context) {
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

module.exports = utils;
