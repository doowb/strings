
var frep = require('frep');
var _ = require('lodash');

// new Strings();
// Strings()

var Strings = function () {
  if (!(this instanceof Strings)) {
    return new Strings();
  }
  this._replacements = {};
};

Strings.prototype.add = function (name, arr) {
  arr = arr || [];
  if (!Array.isArray(arr)) {
    arr = [arr];
  }
  this._replacements[name] = (this._replacements[name] || []).concat(arr);
  return this;
};

Strings.prototype.get = function (name) {
  return this._replacements[name];
};

Strings.prototype.replacements = function () {
  var arr = [];
  _.forOwn(this._replacements, function (value) {
    arr = arr.concat(value);
  });
  return arr;
};

Strings.prototype.run = function (structure, name) {
  var replacements = this.get(name) || this.replacements();
  return frep.strWithArr(structure, replacements);
};
