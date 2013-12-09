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

var strings = module.exports = function(structure, options) {
  this.structure = structure || '';
  this.options = options || {};
  this.middleware = [];

  return this;
};

var expand = function(middleware) {
  return function(context) {
    return _.expand(context, middleware());
  };
};

var remove = function(middleware) {
  return function(context) {
    return _.omit(context, middleware());
  };
};

strings.use = function(middleware) {
  this.middleware.push(expand(middleware));
  return this;
};

strings.exclude = function(middleware) {
  this.middleware.push(remove(middleware));
  return this;
};

strings.run = function(options) {
  var context = _.reduce(this.middleware, function(ctx, middleware) {
    return middleware(ctx);
  });

  return _.template(this.structure, context);
};