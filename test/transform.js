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



describe('.transform()', function () {

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

  it('should get a stored propstring', function () {
    var expected = '_gh_pages/blog/file/index.html';

    var context = {
      destbase: '_gh_pages',
      src: 'blog/file.html',
    };

    var actual = strings.use('permalinks', context);
    expect(actual).to.eql(expected);
  });


  it('should get a stored propstring', function () {
    var expected = ':destbase/:dirname/:basename/index:ext';
    var actual = strings.propstring('pretty');
    expect(actual).to.eql(expected);
  });

  it('when a propstring and parser object are passed in', function () {
    var expected = ':destbase/:dirname/file/index.html';
    var parser = {
      ':basename': 'file',
      ':ext': '.html'
    };
    var actual = strings.transform('pretty', parser);
    expect(actual).to.eql(expected);
  });

  it('when a propstring, parser object, and context are passed in', function () {
    var path = require('path');
    var expected = '_gh_pages/:dirname/file/index.html';
    var parser = {
      ':basename': function () {
        return path.basename(this.filepath, path.extname(this.filepath));
      },
      ':ext': function () {
        return path.extname(this.filepath);
      },
      ':destbase': function () {
        return this.destbase;
      }
    };
    var context = {
      filepath: 'path/to/my/file.html',
      destbase: '_gh_pages'
    };
    var actual = strings.transform('pretty', parser, context);
    expect(actual).to.eql(expected);
  });

  describe('when a default value is passed in the parser', function () {
    it('should be used if it\'s not on the context', function () {
      var path = require('path');
      var expected = './:dirname/file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        },
        ':destbase': function () {
          return this.destbase || '.';
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };

      strings.parser('path', parser);
      var actual = strings.transform('pretty', 'path', context);
      expect(actual).to.eql(expected);
    });
  });

});
