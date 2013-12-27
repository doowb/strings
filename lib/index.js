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

var Strings = require('./strings');

var strings = module.exports = function(structure, options) {
  return new Strings(structure, options);
};

// middleware
var middleware = require('./middleware');
_.map(middleware, function(value, key) {
	strings[key] = value;
});