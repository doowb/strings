/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('chai').expect;
var Strings = require('../');

describe('.template()', function () {

  var strings;
  before(function () {
    strings = new Strings();
  });

  it('when a template is passed', function () {
    var actual = strings.replace(':a/:b/:c:ext', {
      a: 'foo',
      b: 'bar',
      c: 'baz',
      ext: '.js'
    });
    expect(actual).to.eql('foo/bar/baz.js');
  });

  it('when a template is passed', function () {
    var actual = strings.replace('{a}/{b}/{c}:ext', {
      a: 'foo',
      b: 'bar',
      c: 'baz',
      ext: '.js'
    });
    expect(actual).to.eql('foo/bar/baz.js');
  });

  it('when a template and parser object are passed', function () {
    var actual = strings.replace(':basename/index:ext', {
      basename: 'file',
      ext: '.html'
    });
    expect(actual).to.eql('file/index.html');
  });
});