/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('chai').expect;
var Strings = require('../');

describe('.replacement()', function() {
  var strings = new Strings();

  describe('when a replacement is set', function() {
    it('should be stored by Strings on the `_replacements` object:', function () {
      strings.replacement('a', 'b');
      expect(strings._replacements).to.have.property('a');
      expect(strings._replacements['a']).to.eql('b');
    });

    it('should be retrievable using `replacement(name)`', function () {
      var replacement = function(match) { return match; };
      strings.replacement('b', replacement);
      expect(strings.replacement('b')).to.eql(replacement);
      expect(strings.replacement('b')).to.be.an.instanceof(Function);
    });
  });

});
