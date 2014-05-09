var _str = require('underscore.string');

module.exports = function(str, slugify) {
  if (typeof slugify === 'function') {
    return slugify(str);
  }
  return slugify ? _str.slugify(str) : str;
};