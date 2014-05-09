/**
 * Sellside
 *
 * Sellside <http://www.sellside>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var slugify = require('../middleware/slugify');

describe('slugify', function() {
  var url = 'https://github.com/sellside/strings.git?sortby=name?';

  describe('when `slugify` is not defined in the options', function() {
    it('should return the original string', function() {
      var actual = slugify(url);
      expect(actual).to.eql(url);
    });
  });

  describe('when `slugify: false` is defined in the options', function() {
    it('should return the original string', function() {
      var actual = slugify(url, false);
      expect(actual).to.eql(url);
    });
  });

  describe('when `slugify: true` is not defined in the options', function() {
    it('should slugify the string', function() {
      var expected = 'httpsgithubcomsellsidestringsgitsortbyname';
      var actual = slugify(url, true);
      expect(actual).to.eql(expected);
    });
  });

  describe('when a custom function is passed to the `slugify` option', function() {
    it('should slugify the string using the custom function', function() {
      var _slugify = function(str) {
        return str.replace(/\W+/g, '-').replace(/^\W|\W$/, '');
      };
      var expected = 'https-github-com-sellside-strings-git-sortby-name';
      var actual = slugify(url, _slugify);
      expect(actual).to.eql(expected);
    });
  });
});