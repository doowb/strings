/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var moment = require('moment');
var _ = require('lodash');

var momentFormat = function(date, _format) {
  return moment(date).format(_format);
};

var dateMappings = {
  'date'      : 'YYYY/MM/DD',
  'L'         : 'MM/DD/YYYY',
  '1'         : 'M/D/YYYY',
  'year'      : 'YYYY',
  'YYYY'      : 'YYYY',
  'YY'        : 'YY',
  'monthname' : 'MMMM',
  'MMMM'      : 'MMMM',
  'MMM'       : 'MMM',
  'month'     : 'MM',
  'MM'        : 'MM',
  'mo'        : 'MM',
  'M'         : 'M',
  'DDDD'      : 'DDDD',
  'DDD'       : 'DDD',
  'day'       : 'DD',
  'DD'        : 'DD',
  'D'         : 'D',
  'dddd'      : 'dddd',
  'ddd'       : 'ddd',
  'dd'        : 'dd',
  'd'         : 'd',
  'hour'      : 'HH',
  'HH'        : 'HH',
  'H'         : 'H',
  'hh'        : 'hh',
  'h'         : 'h',
  'minute'    : 'mm',
  'min'       : 'mm',
  'mm'        : 'mm',
  'm'         : 'm',
  'second'    : 'ss',
  'sec'       : 'ss',
  'ss'        : 'ss',
  's'         : 's',
  'A'         : 'A',
  'a'         : 'a',
  'P'         : 'P',
  'p'         : 'p'
};

function makeParsers(dates, options) {
  var results = [];
  _(dates).forOwn(function (value, key) {
    var parser = {
      pattern: new RegExp(':\\b' + key + '\\b'),
      replacement: function () {
        return momentFormat(this.date, value);
      }
    };
    results.push(parser);
  });
  return results;
}

module.exports = function (options) {
  options = options || {};
  options.lang = options.lang || 'en';
  moment.lang(options.lang);

  return makeParsers(dateMappings, options);
};