/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');

describe('.parser() - add', function() {
  var strings = new Strings();
  describe('when a named parser is defined', function() {
    it('should replace values with strings', function () {
      var name = 'test-parser-1';
      var actual = [{
        ':basename': 'foo',
        ':ext': '.html'
      }];
      strings.parser(name, actual);
      expect(strings._parsers).to.have.property(name);
      expect(actual).to.eql(strings._parsers[name]);
    });

    it('should replace values with functions', function () {
      var name = 'test-parser-1';
      var actual = [{
        ':basename': function () {
          return 'foo';
        },
        ':ext': function () {
          return '.html';
        }
      }];

      strings.parser(name, actual);
      expect(strings._parsers).to.have.property(name);
      expect(actual).to.eql(strings._parsers[name]);
    });
  });
});


describe('.parser() - get', function() {
  var strings = new Strings();
  describe('when only one paramter is passed', function() {
    it('it should retrieve the stored parser with the given name', function () {
      var name = 'test-parser-2';
      var actual = [{
        ':basename': function () {
          return 'foo';
        },
        ':ext': function () {
          return '.html';
        }
      }];
      strings.parser(name, actual);
      expect(actual).to.eql(strings.parser(name));
    });
  });
});
