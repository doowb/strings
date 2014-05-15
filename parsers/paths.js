/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');

function paths(options) {

  options = options || {};

  return {
    ':basename': function () {
      var filepath = this.filepath || options.filepath || '';
      return path.basename(filepath, path.extname(filepath));
    },
    ':filename': function () {
      return path.basename(this.filepath || options.filepath || '');
    },
    ':ext': function () {
      return path.extname(this.filepath || options.filepath || '');
    },
    ':dir': function () {
      return path.dirname(this.filepath || options.filepath || '');
    }
  };
}

module.exports = paths;
