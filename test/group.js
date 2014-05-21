/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');


describe('.group()', function() {
  var strings;
  before(function () {
    strings = new Strings();
  });

  it('when adding a named group, it should be in `_groups`', function () {
    var name = 'a';
    var propstring = 'b';
    var parsers = ['a', 'b'];
    var expected = {propstring: propstring, parsers: parsers};

    strings.group(name, propstring, parsers);

    expect(strings._groups).to.have.property(name);
    expect(expected).to.eql(strings._groups[name]);
  });

  it('when adding a named group, it should be gotten through `group(name)`', function () {
    var name = 'a';
    var propstring = 'b';
    var parsers = ['a', 'b'];
    var actual = strings.group(name);
    var expected = {propstring: propstring, parsers: parsers};

    strings.group(name, propstring, parsers);
    expect(expected).to.eql(strings.group(name));
  });
});