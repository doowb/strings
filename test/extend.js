/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');

describe('.extend()', function() {
  var strings = new Strings();

  strings.parser('a', {pattern: 'a', replacement: 'b'});


  describe('when a named parser is extended', function() {
    it('should have all values', function () {
      strings.extend('a', {pattern: 'c', replacement: 'd'});
      var actual = strings.parser('a');

      expect(actual[0].pattern).to.equal('a');
      expect(actual[1].pattern).to.equal('c');
    });
  });
});