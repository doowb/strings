/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var _str = require('underscore.string');
var noop = function(str) { return str; }

var parsePath = module.exports = function parsePath(filePath, options) {
  options = options || {};
  var slugify = noop;

  if (options.slugify) {
    slugify = _str.slugify;
  }

  var dir = path.dirname(filePath);
  var ext = path.extname(filePath);
  var filename = path.basename(filePath);
  var basename = path.basename(filePath, ext);

  return function() {
    return {
      basename: slugify(basename),
      filename: slugify(filename),
      ext: slugify(ext),
      dir: slugify(dir)
    };
  };
};