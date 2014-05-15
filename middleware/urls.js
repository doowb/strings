/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var url = require('url');

function urls (options) {
  var parsed = url.parse('');

  options = options || {};

  var result = {};
  var replacement = function (match, segment) {
    return url.parse(this.url || options.url || '')[segment];
  };

  var key;
  for (key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      result[':(' + key + ')'] = replacement;
    }
  }
  return result;
}

module.exports = urls;
