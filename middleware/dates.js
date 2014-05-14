/**
 * Strings <https://github.com/sellside/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var moment = require('moment');
var _str = require('underscore.string');
var slugify = require('./slugify');
var Pattern = require('../lib/pattern');


var format = function(d, options) {
  moment.lang(options.lang);
  return function(f) {
    return moment(d).format(f);
  };
};

module.exports = function dates(d, options) {
  options = options || {};
  var _slugify = options.slugify || false;
  options.lang = options.lang || 'en';

  var formatter = format(d, options);

  /**
   * Date patterns
   */

  var datePatterns = {
    // Full date
    'date': new Pattern(/:\bdate\b/,            slugify(formatter("YYYY/MM/DD"), _slugify)),

    // Long date formats
    'L': new Pattern(/:\bL\b/,                  slugify(formatter("MM/DD/YYYY"), _slugify)),
    '1': new Pattern(/:\b1\b/,                  slugify(formatter("M/D/YYYY"), _slugify)),

    // Year (2013, 13)
    'year': new Pattern(/:\byear\b/,            slugify(formatter("YYYY"), _slugify)),
    'YYYY': new Pattern(/:\bYYYY\b/,            slugify(formatter("YYYY"), _slugify)),
    'YY': new Pattern(/:\bYY\b/,                slugify(formatter("YY"), _slugify)),

    // Month name (January, Jan)
    'monthname': new Pattern(/:\bmonthname\b/,  slugify(formatter("MMMM"), _slugify)),
    'MMMM': new Pattern(/:\bMMMM\b/,            slugify(formatter("MMMM"), _slugify)),
    'MMM': new Pattern(/:\bMMM\b/,              slugify(formatter("MMM"), _slugify)),

    // Month number (1, 01)
    'month': new Pattern(/:\bmonth\b/,          slugify(formatter("MM"), _slugify)),
    'MM': new Pattern(/:\bMM\b/,                slugify(formatter("MM"), _slugify)),
    'mo': new Pattern(/:\bmo\b/,                slugify(formatter("MM"), _slugify)),
    'M': new Pattern(/:\bM\b/,                  slugify(formatter("M"), _slugify)),

    // Day of the year
    'DDDD': new Pattern(/:\bDDDD\b/,            slugify(formatter("DDDD"), _slugify)),
    'DDD': new Pattern(/:\bDDD\b/,              slugify(formatter("DDD"), _slugify)),

    // Day of the month
    'day': new Pattern(/:\bday\b/,              slugify(formatter("DD"), _slugify)),
    'DD': new Pattern(/:\bDD\b/,                slugify(formatter("DD"), _slugify)),
    'D': new Pattern(/:\bD\b/,                  slugify(formatter("D"), _slugify)),

    // Day of the week (wednesday/wed)
    'dddd': new Pattern(/:\bdddd\b/,            slugify(formatter("dddd"), _slugify)),
    'ddd': new Pattern(/:\bddd\b/,              slugify(formatter("ddd"), _slugify)),
    'dd': new Pattern(/:\bdd\b/,                slugify(formatter("dd"), _slugify)),
    'd': new Pattern(/:\bd\b/,                  slugify(formatter("d"), _slugify)),

    // Hour
    'hour': new Pattern(/:\bhour\b/,            slugify(formatter("HH"), _slugify)),
    'HH': new Pattern(/:\bHH\b/,                slugify(formatter("HH"), _slugify)),
    'H': new Pattern(/:\bH\b/,                  slugify(formatter("H"), _slugify)),
    'hh': new Pattern(/:\bhh\b/,                slugify(formatter("hh"), _slugify)),
    'h': new Pattern(/:\bh\b/,                  slugify(formatter("h"), _slugify)),

    // Minute
    'minute': new Pattern(/:\bminute\b/,        slugify(formatter("mm"), _slugify)),
    'min': new Pattern(/:\bmin\b/,              slugify(formatter("mm"), _slugify)),
    'mm': new Pattern(/:\bmm\b/,                slugify(formatter("mm"), _slugify)),
    'm': new Pattern(/:\bm\b/,                  slugify(formatter("m"), _slugify)),

    // Second
    'second': new Pattern(/:\bsecond\b/,        slugify(formatter("ss"), _slugify)),
    'sec': new Pattern(/:\bsec\b/,              slugify(formatter("ss"), _slugify)),
    'ss': new Pattern(/:\bss\b/,                slugify(formatter("ss"), _slugify)),
    's': new Pattern(/:\bs\b/,                  slugify(formatter("s"), _slugify)),

    // AM/PM, am/pm
    'A': new Pattern(/:\bA\b/,                  slugify(formatter("A"), _slugify)),
    'a': new Pattern(/:\ba\b/,                  slugify(formatter("a"), _slugify)),
    'P': new Pattern(/:\bP\b/,                  slugify(formatter("P"), _slugify)),
    'p': new Pattern(/:\bp\b/,                  slugify(formatter("p"), _slugify))
  };


  return function() {
    return datePatterns;
  };
};