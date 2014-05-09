/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var url = require('url');
var slugify = require('./slugify');

module.exports = function urls(str, options) {
  var parsed = url.parse(str);

  options = options || {};
  var _slugify = options.slugify || false;

  return function() {
    var result = {};
    for (var key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        result[key] = slugify(parsed[key], _slugify);
      }
    }
    return result;
  };
};