/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');

describe('.replacement()', function() {
  var strings = new Strings();
  describe('when a replacement is set', function() {
    it('should be stored by Strings on the `_replacements` object:', function () {
      var name = 'a';
      var replacement = 'b';
      strings.replacement(name, replacement);
      var actual = strings._replacements[name];
      expect(strings._replacements).to.have.property(name);
      expect(actual).to.eql(replacement);
    });

    it('should be retrievable using `replacement(name)`', function () {
      var name = 'b';
      var replacement = function(match) { return match; };
      strings.replacement(name, replacement);
      var actual = strings.replacement(name);
      expect(replacement).to.eql(replacement);
      expect(actual).to.be.an.instanceof(Function);
    });
  });
});
