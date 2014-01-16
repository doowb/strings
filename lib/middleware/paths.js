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

var _s = require('underscore.string');
var path = require('path');

var paths = module.exports = function(filePath, options) {

  options = options || { slugify: false };
  var slugify = ((typeof options.slugify !== 'undefined') && options.slugify === false) ? false : true;

  var dir = path.dirname(filePath);
  var ext = path.extname(filePath);
  var filename = path.basename(filePath);
  var basename = path.basename(filePath, ext);

  return function() {
    return {
      basename: slugify ? _s.slugify(basename) : basename,
      filename: slugify ? _s.slugify(filename) : filename,
      ext: slugify ? _s.slugify(ext) : ext,
      dir: slugify ? _s.slugify(dir) : dir
    };
  };
};