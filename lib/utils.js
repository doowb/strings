/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');
var utils = module.exports = {};


utils._wrap = function (ctx) {
  return function () {
    return ctx;
  };
};

utils._ensureMiddleware = function (middleware) {
  if (_.isFunction(middleware) === false) {
    return utils._wrap(middleware);
  }
  return middleware;
};

utils._normalize = function (replacements) {
  var arr = [];
  if (Array.isArray(replacements)) {
    // [{key: value}, {key, value}] => [{pattern: key, replacement: value], {pattern:key, replacement: value}]
    var i;
    for (i = 0; i < replacements.length; i++) {
      arr = arr.concat(utils._normalizeObject(replacements[i]));
    }
  } else {
    // {key: value} => [{pattern: key, replacement: value}];
    arr = arr.concat(utils._normalizeObject(replacements));
  }
  return arr;
};

utils._normalizeObject = function (object) {
  if ('pattern' in object && 'replacement' in object) {
    return [object];
  }

  var arr = [];
  _.forOwn(object, function (value, key) {
    arr.push({pattern: key, replacement: value});
  });

  return arr;
};

utils._extend = function (middleware) {
  return function (context) {
    return _.extend(context, utils._ensureMiddleware(middleware)());
  };
};

utils._remove = function (middleware) {
  return function (context) {
    return _.omit(context, utils._ensureMiddleware(middleware)());
  };
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
