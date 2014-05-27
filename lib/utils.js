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


utils._normalizeObject = function (obj) {

  if (_.isUndefined(obj)) {
    return [];
  }

  if (obj.hasOwnProperty('pattern') && obj.hasOwnProperty('replacement')) {
    return [obj];
  }

  var arr = [];
  _.forOwn(obj, function (value, key) {
    arr.push({pattern: key, replacement: value});
  });

  return arr;
};


utils._bind = function (replacements, context) {
  replacements = _.cloneDeep(replacements);
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
