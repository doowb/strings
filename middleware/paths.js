/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var slugify = require('./slugify');

var parsePath = module.exports = function parsePath(filepath, options) {
  options = options || {};

  var dir = path.dirname(filepath);
  var ext = path.extname(filepath);
  var filename = path.basename(filepath);
  var basename = path.basename(filepath, ext);

  return function() {
    return {
      basename: slugify(basename, options.slugify),
      filename: slugify(filename, options.slugify),
      ext: slugify(ext, options.slugify),
      dir: slugify(dir, options.slugify)
    };
  };
};