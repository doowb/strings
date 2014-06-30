/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('chai').expect;
var Strings = require('../');


describe('.parser', function() {
  var strings;

  beforeEach(function() {
    strings = new Strings();
  });

  describe('when a named parser is defined', function() {
    it('should replace values with strings', function () {
      var actual = [{
        ':basename': 'foo',
        ':ext': '.html'
      }];
      strings.parser('a', actual);
      expect(strings._parsers).to.have.property('a');
      expect(actual).to.eql(strings._parsers['a']);
    });

    it('should replace values with functions', function () {
      var actual = [{
        ':basename': function () {
          return 'foo';
        },
        ':ext': function () {
          return '.html';
        }
      }];

      strings.parser('b', actual);
      expect(strings._parsers).to.have.property('b');
      expect(actual).to.eql(strings._parsers['b']);
    });
  });

  describe('when only one paramter is passed', function() {
    it('it should get the parser with the given name', function () {
      var parser = {
        ':basename': function () {
          return 'foo';
        },
        ':ext': function () {
          return '.html';
        }
      };
      strings.parser('c', parser);
      expect(strings.parser('c')).to.eql([parser]);
    });
  });
});
