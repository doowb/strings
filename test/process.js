/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');



describe('.process()', function () {

  var strings;
  before(function () {
    strings = new Strings();
    strings.propstring('pretty', ':basename/index:ext');
  });

  it('when a propstring is passed in', function () {
    var expected = ':basename/index:ext';
    var actual = strings.process('pretty');
    expect(actual).to.eql(expected);
  });

  it('when a propstring and parser object are passed in', function () {
    var expected = 'file/index.html';
    var parser = {
      ':basename': 'file',
      ':ext': '.html'
    };
    var actual = strings.process('pretty', parser);
    expect(actual).to.eql(expected);
  });

  it('when a propstring, parser object, and context are passed in', function () {
    var path = require('path');
    var expected = 'file/index.html';
    var parser = {
      ':basename': function () {
        return path.basename(this.filepath, path.extname(this.filepath));
      },
      ':ext': function () {
        return path.extname(this.filepath);
      }
    };
    var context = {
      filepath: 'path/to/my/file.html'
    };
    var actual = strings.process('pretty', parser, context);
    expect(actual).to.eql(expected);
  });

  it('when a propstring, named parser, and context are passed in', function () {
    var path = require('path');
    var expected = 'file/index.html';
    var parser = {
      ':basename': function () {
        return path.basename(this.filepath, path.extname(this.filepath));
      },
      ':ext': function () {
        return path.extname(this.filepath);
      }
    };
    var context = {
      filepath: 'path/to/my/file.html'
    };

    strings.parser('path', parser);
    var actual = strings.process('pretty', 'path', context);
    expect(actual).to.eql(expected);
  });

});
