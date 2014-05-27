/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var path = require('path');
var expect = require('chai').expect;
var Strings = require('../');



describe('.use()', function () {

  var strings;
  before(function () {
    strings = new Strings();
    strings.propstring('pretty', ':destbase/:dirname/:basename/index:ext');
    strings.parser('pretty', [
      {
        pattern: ':destbase',
        replacement: function () {
          return this.destbase;
        }
      },
      {
        pattern: ':dirname',
        replacement: function () {
          return path.dirname(this.src);
        }
      },
      {
        pattern: ':basename',
        replacement: function () {
          return path.basename(this.src, path.extname(this.src));
        },
      },
      {
        pattern: ':ext',
        replacement: function () {
          return path.extname(this.src);
        }
      }
    ]);
    strings.template('permalinks', 'pretty', ['pretty']);
  });

  it('should use a stored propstring and stored parsers with the given context', function () {
    var context = {destbase: 'foo', src: 'a/b.html'};
    var expected = 'foo/a/b/index.html';

    var actual = strings.use('permalinks', context);
    expect(actual).to.eql(expected);
  });

  it('should use a stored propstring and stored parsers with the given context', function () {
    var context = {destbase: 'bar', src: 'a/b.html'};
    var expected = 'bar/a/b/index.html';

    var actual = strings.use('permalinks', context);
    expect(actual).to.eql(expected);
  });
});
