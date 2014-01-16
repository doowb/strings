/**
 * Sellside
 *
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */
var _s = require('underscore.string');
var url = require('url');

var slugified = function(str, slugify) {
  return slugify ? _s.slugify(str) : str;
};

var urls = module.exports = function(str, options) {

  options = options || { slugify: false };
  var slugify = ((typeof options.slugify !== 'undefined') && options.slugify === false) ? false : true;

  var parsed = url.parse(str);

  // TODO: figure out if we need more info here.

  return function() {
    var rtn = {};
    for (var key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        rtn[key] = slugified(parsed[key], slugify);
      }
    }

    return rtn;
  };
};