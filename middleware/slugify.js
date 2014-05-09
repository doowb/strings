var _str = require('underscore.string');

module.exports = function(str, slugify) {
  return slugify ? _str.slugify(str) : str;
};