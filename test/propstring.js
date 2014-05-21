/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');

describe('.propstring()', function() {
  var strings = new Strings();
  describe('when a propstring is set', function() {
    it('should be stored by Strings on the `_propstrings` object:', function () {
      var name = 'test1';
      var template = ':foo/:baz/:basename/index:ext';
      strings.propstring(name, template);
      var actual = strings._propstrings[name];
      expect(strings._propstrings).to.have.property(name);
      expect(actual).to.eql(template);
    });

    it('should be retrievable using `propstring(name)`', function () {
      var name = 'test2';
      var template = ':basename/index:ext';
      strings.propstring(name, template);
      var actual = strings.propstring(name);
      expect(template).to.eql(template);
    });
  });
});
