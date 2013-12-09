/**
 * Sellside
 *
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

var _ = require('lodash');

var Strings = function(structure, options) {
  this.structure = structure || '';
  this.options = options || {};
  this.middleware = [];
};

var strings = module.exports = function(structure, options) {
  return new Strings(structure, options);
};

var extend = function(middleware) {
  return function(context) {
    return _.extend(context, middleware());
  };
};

var remove = function(middleware) {
  return function(context) {
    return _.omit(context, middleware());
  };
};

Strings.prototype.use = function(middleware) {
  this.middleware.push(extend(middleware));
  return this;
};

Strings.prototype.exclude = function(middleware) {
  this.middleware.push(remove(middleware));
  return this;
};

Strings.prototype.context = function() {
  return _.reduce(this.middleware, function(ctx, middleware) {
    return middleware(ctx);
  }, {});
};

Strings.prototype.run = function(options) {
  return _.template(this.structure, this.context());
};