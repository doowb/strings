/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var basename = require('path').basename;
var extname = require('path').extname;
var expect = require('chai').expect;
var Strings = require('../strings.js');


describe('strings', function () {
  describe('using object based replacements', function () {
    describe('should build the string', function() {

      it('when given a structure, use all replacement groups', function () {
        var filepath = '/path/to/my/file.html';
        var strings = new Strings();
        strings.set('path', {
          ':basename': basename(filepath, extname(filepath)),
          ':ext': extname(filepath)
        });
        strings.set('custom', {
          ':foo': 'bar',
          ':baz': 'bang'
        });
        var actual = strings.process(':foo/:baz/:basename/index:ext');
        expect(actual).to.eql('bar/bang/file/index.html');
      });

      it('when given a named replacement group and a structure', function () {
        var filepath = '/path/to/my/file.html';
        var strings = new Strings();
        strings.set('path', {
          ':basename': basename(filepath, extname(filepath)),
          ':ext': extname(filepath)
        });
        var actual = strings.process('/:basename/index:ext', 'path');
        expect(actual).to.eql('/file/index.html');
      });

      it('when given a named replacement group, a structure, and a context', function() {
        var strings = new Strings();

        strings.set('path', {
          ':basename': function () {
            return basename(this.filepath, extname(this.filepath));
          },
          ':ext': function () {
            return extname(this.filepath);
          }
        });

        var actual = strings.process('/:basename/index:ext', 'path', {
          filepath: '/path/to/my/file.html'
        });
        expect(actual).to.eql('/file/index.html');
      });
    });
  });


  describe('using array based replacements', function () {
    describe('should build the string', function() {
      it('when given a structure, use all replacement groups', function () {
        var strings = new Strings();

        var filepath = '/path/to/my/file.html';
        strings.set('path', [
          { pattern: ':basename', replacement: basename(filepath, extname(filepath)) },
          { pattern: ':ext', replacement: extname(filepath) }
        ]);
        strings.set('custom', {
          ':foo': 'bar',
          ':baz': 'bang'
        });

        var actual = strings.process(':foo/:baz/:basename/index:ext');
        expect(actual).to.eql('bar/bang/file/index.html');
      });

      it('when given a named replacement group and a structure', function () {
        var strings = new Strings();

        var filepath = '/path/to/my/file.html';
        strings.set('path', [
          {
            pattern: ':basename',
            replacement: basename(filepath, extname(filepath))
          },
          {
            pattern: ':ext',
            replacement: extname(filepath)
          }
        ]);
        var actual = strings.process('/:basename/index:ext', 'path');
        expect(actual).to.eql('/file/index.html');
      });

      it('when given a named replacement group, a structure, and a context', function() {
        var strings = new Strings();

        strings.set('path', [
          {
            pattern: ':basename',
            replacement: function () {
              return basename(this.filepath, extname(this.filepath));
            }
          },
          {
            pattern: ':ext',
            replacement: function () {
              return extname(this.filepath);
            }
          }
        ]);
        var actual = strings.process('/:basename/index:ext', 'path', {
          filepath: '/path/to/my/file.html'
        });
        expect(actual).to.eql('/file/index.html');
      });
    });
  });
});
