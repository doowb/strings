/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var expect = require('chai').expect;
var Strings = require('../');


describe('.run', function () {

  var strings;
  beforeEach(function () {
    strings = new Strings();
  });

  it('when a template with a parser object are passed', function () {
    strings.propstring('pretty', ':base/index:ext');
    // Set the `blog` template
    strings.template('blog', 'pretty', {
      ':base': 'post',
      ':ext': '.html'
    });
    expect(strings.run('blog')).to.eql('post/index.html');
  });

  it('when a template with a parser object and context are passed', function () {
    strings.propstring('pretty', ':basename/index:ext');
    strings.template('blog', 'pretty', {
      ':basename': function () {
        return path.basename(this.foo, path.extname(this.foo));
      },
      ':ext': function () {
        return path.extname(this.foo);
      }
    });

    var actual = strings.run('blog', {foo: 'path/to/my/file.html'});
    expect(actual).to.eql('file/index.html');
  });

  it('when a template with a named parser, and context are passed', function () {
    strings.propstring('a', ':aaa/:bbb:ext');
    strings.propstring('c', ':ccc/:ddd:ext');

    strings.parser('foo', {
      ':aaa': function () {
        return path.basename(this.nonsense, path.extname(this.nonsense));
      },
      ':bbb': 'index',
      ':ext': function () {
        return path.extname(this.nonsense);
      }
    });
    strings.parser('bar', {
      ':ccc': function () {
        return path.basename(this.nonsense, path.extname(this.nonsense));
      },
      ':ddd': 'index',
      ':ext': function () {
        return path.extname(this.nonsense);
      }
    });

    strings.template('alpha', 'a', 'foo');
    strings.template('beta', 'c', 'bar');

    var actual1 = strings.run('alpha', {
      nonsense: 'path/to/my/file.html'
    });
    var actual2 = strings.run('beta', {
      nonsense: 'path/to/my/file.html'
    });

    expect(actual1).to.eql('file/index.html');
    expect(actual2).to.eql('file/index.html');
  });
});
