/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('chai').expect;
var path = require('path');
var Strings = require('..');


describe('.template', function() {
  var strings;
  beforeEach(function () {
    strings = new Strings();
    strings.propstring('pretty', ':a/:b/:c/index:d');
    strings.parser('path', {
      ':a': function () {
        return this.destbase;
      },
      ':b': function () {
        return path.dirname(this.src);
      },
      ':c': function () {
        return path.basename(this.src, path.extname(this.src));
      },
      ':d': function () {
        return path.extname(this.src);
      }
    });
    strings.template('permalinks', 'pretty', ['path']);
  });


  it('when a template without a parser object is passed', function () {
    strings.propstring('aaa', ':basename/index:ext');
    var actual = '';
    try {
      strings.template('foo', 'aaa');
    } catch(err) {
      actual = err;
    }
    expect(/Error/.test(actual)).to.be.true;
    strings._propstrings = {};
  });

  describe('when a single argument is passed', function () {
    it('should lookup template by the given string', function () {
      var expected = {
        propstring: ':a/:b/:c/index:d',
        parsers: ['path']
      };
      expect(strings.template('permalinks')).to.eql(expected);
    });
  });

  describe('when template is set', function () {
    it('should be in on the `_templates` object', function () {
      strings.template('a', 'b', ['a', 'b']);
      expect(strings._templates).to.have.property('a');
      expect(strings._templates['a']).to.eql({propstring: 'b', parsers: ['a', 'b']});
      expect(strings.template('a')).to.eql({propstring: 'b', parsers: ['a', 'b']});
    });
  });

  describe('when propstring and parsers are passed as properties on an object', function () {
    it('should return the template by name', function () {
      strings.template('foo', {propstring: 'pretty', parsers: ['path']});
      var expected = {
        propstring: ':a/:b/:c/index:d',
        parsers: ['path']
      };
      expect(strings.template('foo')).to.eql(expected);
    });
  });

  it('should get a stored propstring', function () {
    var actual = strings.propstring('pretty');
    expect(actual).to.eql(':a/:b/:c/index:d');
  });
});
