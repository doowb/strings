/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');


var wrap = function (ctx) {
  return function () {
    return ctx;
  };
};

var ensureMiddleware = function (middleware) {
  if (_.isFunction(middleware) === false) {
    return wrap(middleware);
  }
  return middleware;
};

exports.extend = function (middleware) {
  return function (context) {
    return _.extend(context, ensureMiddleware(middleware)());
  };
};

exports.remove = function (middleware) {
  return function (context) {
    return _.omit(context, ensureMiddleware(middleware)());
  };
};