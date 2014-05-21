/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');


describe('.parsers() -list', function () {
  var strings;
  before(function () {
    strings = new Strings();
    strings.parser('objLiteralParser', {':foo': 'bar'});
    strings.parser('objReplacementsParser', {pattern: ':bar', replacement: 'baz'});
    strings.parser('objReplacementsFnParser', {pattern: ':baz', replacement: function () {return 'bing';}});
    strings.parser('arrObjLiteralParser', [{ ':arrFoo': 'arrBar' }, { ':arrBar': 'arrBaz' }]);
    strings.parser('arrObjReplacementsParser', [
      { pattern: ':arrBaz', replacement: 'arrBing' },
      { pattern: ':arrBing', replacement: 'arrBang' }
    ]);
    strings.parser('arrObjReplacementsFnParser', [
      { pattern: ':arrBang', replacement: function () { return 'arrBong'; } },
      { pattern: ':arrBeep', replacement: function () { return 'arrBoop'; } }
    ]);
  });

  describe('when passing in a single string as a replacement', function () {
    it('should parse and return the modified string', function () {
      var expected = [{ pattern: ':foo', replacement: 'bar' }];
      var actual = strings.parsers('objLiteralParser');
      expect(actual).to.eql(expected);
    });

    it('when passing in an array with a single string', function () {
      var expected = [{ pattern: ':bar', replacement: 'baz' }];
      var actual = strings.parsers(['objReplacementsParser']);
      expect(actual).to.eql(expected);
    });

    it('when passing in an array of strings', function () {
      var expected = [
        { pattern: ':bar', replacement: 'baz' },
        { pattern: ':baz', replacement: function () { return 'bing'; } }
      ];
      var actual = strings.parsers(['objReplacementsParser', 'objReplacementsFnParser']);
      expect(actual.length).to.eql(expected.length);
    });

    it('when passing in an array with a multiple types', function () {
      var expected = [
        { pattern: ':bar', replacement: 'baz' },
        { pattern: ':basename', replacement: 'file' },
        { pattern: ':ext', replacement: 'ext' }
      ];
      var actual = strings.parsers(['objReplacementsParser', {':basename': 'file', ':ext': 'ext'}]);
      expect(actual).to.eql(expected);
    });

    it('when passing in `undefined`', function () {
      var actual = strings.parsers();
      expect(actual.length).to.eql(9);
    });
  });
});
