/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');

describe('.pattern()', function() {
  var strings = new Strings();
  describe('when a pattern is set', function() {
    it('should be stored by Strings on the `_patterns` object:', function () {
      var name = 'a';
      var pattern = /alpha/g;
      strings.pattern(name, pattern);
      var actual = strings._patterns[name];
      expect(strings._patterns).to.have.property(name);
      expect(actual).to.eql(pattern);
      expect(actual).to.be.an.instanceof(RegExp);
    });

    it('should be retrievable using `pattern(name)`', function () {
      var name = 'b';
      strings.pattern(name, 'beta');
      var actual = strings.pattern(name);
      expect(actual).to.eql(new RegExp('beta'));
      expect(actual).to.be.an.instanceof(RegExp);
    });

    it('should be retrievable using `pattern(name)`', function () {
      var name = 'c';
      strings.pattern(name, 'gamma', 'g');
      var actual = strings.pattern(name);
      expect(actual).to.eql(new RegExp('gamma', 'g'));
      expect(actual).to.be.an.instanceof(RegExp);
    });

    it('should be retrievable using `pattern(name)`', function () {
      var name = 'd';
      var pattern = /gamma/g;
      strings.pattern(name, pattern);
      var actual = strings.pattern(name);
      expect(actual).to.eql(new RegExp('gamma', 'g'));
      expect(actual).to.be.an.instanceof(RegExp);
    });
  });
});
