/**
 * Sellside
 *
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');
var frep = require('frep');

var Pattern = require('./pattern');

var Strings = module.exports = function (structure, options) {
    if (_.isPlainObject(structure)) {
      options = structure;
      this.structure = '';
    } else {
      this.structure = structure || '';
    }
    this.options = options || {};
    this.middleware = [];
  };

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

var extend = function (middleware) {
    return function (context) {
      return _.extend(context, ensureMiddleware(middleware)());
    };
  };

var remove = function (middleware) {
    return function (context) {
      return _.omit(context, ensureMiddleware(middleware)());
    };
  };

Strings.prototype.use = function (middleware) {
  this.middleware.push(extend(middleware));
  return this;
};

Strings.prototype.exclude = function (middleware) {
  this.middleware.push(remove(middleware));
  return this;
};

Strings.prototype.context = function () {
  return _.reduce(this.middleware, function (ctx, middleware) {
    return middleware(ctx);
  }, {});
};

Strings.prototype.patterns = function () {
  var context = this.context();
  var patterns = _.map(context, function (value, key) {
    if (value instanceof Pattern) {
      return value;
    }
    return new Pattern(
    new RegExp(':\\b' + key + '\\b'), // pattern
    value // replacement
    );
  });
  return patterns;
};

Strings.prototype.run = function (structure, options) {
  if (_.isPlainObject(structure)) {
    options = structure;
  } else {
    this.structure = structure || this.structure || '';
  }
  return frep.strWithArr(this.structure, this.patterns());
};