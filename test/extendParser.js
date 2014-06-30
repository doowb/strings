/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('chai').expect;
var Strings = require('../');

describe('.extendParser()', function() {
  var strings = new Strings();

  strings.parser('a', {pattern: 'a', replacement: 'b'});


  describe('when a named parser is extended', function() {
    it('should have all values', function () {
      strings.extendParser('a', {pattern: 'c', replacement: 'd'});
      var actual = strings.parser('a');

      expect(actual[0].pattern).to.equal('a');
      expect(actual[1].pattern).to.equal('c');
    });
  });
});