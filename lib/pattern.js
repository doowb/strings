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

var Pattern = module.exports = function(pattern, replacement) {
	this.pattern = pattern;
	this.replacement = replacement;
};