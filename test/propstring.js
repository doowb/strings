/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('chai').expect;
var Strings = require('../');

describe('.propstring()', function() {
  var strings = new Strings();

  strings.propstring('pretty', ':destbase/:dirname/:basename/index:ext');
  strings.propstring('test1', ':foo/:baz/:basename/index:ext');
  strings.propstring('test2', ':basename/index:ext');


  describe('when a propstring is set', function() {
    it('should be stored by Strings on the `_propstrings` object:', function () {
      var actual = strings._propstrings['test1'];
      expect(strings._propstrings).to.have.property('test1');
      expect(actual).to.eql(':foo/:baz/:basename/index:ext');
    });

    it('should be able to get the propstring using the name', function () {
      var actual = strings.propstring('test2');
      expect(actual).to.eql(':basename/index:ext');
    });


    it('should get a stored propstring', function () {
      var actual = strings.propstring('pretty');
      expect(actual).to.eql(':destbase/:dirname/:basename/index:ext');
    });
  });
});
