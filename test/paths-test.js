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

var Strings = require('../');
var paths = require('../parsers/paths.js');

describe('parsers', function() {

  describe('paths', function() {

    var filepath = '/path/to/foo.html';
    var strings = null;

    before(function(){
      strings = new Strings();
      strings.parser('path', paths());
    });

    it('should replace :basename', function() {
      var expected = 'foo';
      var actual = strings.template(':basename', 'path', {filepath: filepath});
      expect(actual).to.eql(expected);
    });

    it('should replace :filename', function() {
      var expected = 'foo.html';
      var actual = strings.template(':filename', 'path', {filepath: filepath});
      expect(actual).to.eql(expected);
    });

    it('should replace :ext', function() {
      var expected = '.html';
      var actual = strings.template(':ext', 'path', {filepath: filepath});
      expect(actual).to.eql(expected);
    });

    it('should replace dir', function() {
      var expected = '/path/to';
      var actual = strings.template(':dir', 'path', {filepath: filepath});
      expect(actual).to.eql(expected);
    });

  });

});
