/**
 * Sellside
 *
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

var path = require('path');
var basename = require('path').basename;
var extname = require('path').extname;
var inspect = require('util').inspect;
var expect = require('chai').expect
var assert = require('chai').assert;
var _ = require('lodash');

var Strings = require('../lib/strings2.js');

var parseFile = function (filePath) {
  return function () {
    return {
      basename: basename(filePath, extname(filePath)),
      ext: extname(filePath)
    };
  };
};

var testStructure = '/:basename/index:ext';


describe('strings', function () {

  describe('default', function() {

    it('should convert structure to string given an object', function() {

      var src = 'path/to/file.html';
      var expected = '/file/index.html';

      var strings = new Strings();
      strings.add('path', [
        { pattern: ':basename', replacement: path.basename(src, path.extname(src)) },
        { pattern: ':ext', replacement: path.extname(src) }
      ]);

      var actual = strings.run(testStructure, 'path');
      expect(actual).to.eql(expected);

    });


    it('should convert structure to string given an object', function() {

      var src = 'path/to/file.html';
      var expected = '/file/index.html';

      var strings = new Strings();
      var parsed = parseFile(src)();
      strings.add('path', [
        { pattern: ':basename', replacement: parsed.basename },
        { pattern: ':ext', replacement: parsed.ext }
      ]);

      var actual = strings.run(testStructure, 'path');
      expect(actual).to.eql(expected);

    });


    it('should convert structure to string given an object', function() {

      var files = [
        'path/to/file1.html',
        'path/to/file2.html',
        'path/to/file3.html',
        'path/to/file4.html'
      ];

      'path/to/file1.html'.replace(/(:basename)/, function(src) {
        return path.src;
      });

      var strings = new Strings();
      strings.add('path', [
        { pattern: /foo/g, replacement: function (src) { return (src).basename; } },
        { pattern: ':ext', replacement: function (src) { return parseFile(src).ext; } }
      ]);

      for (var i = 1; i <= files.length; i++) {

        var src = files[i-1];
        var expected = '/file' + i + '/index.html';
        var parsed = parseFile(src);


        var actual = strings.run(testStructure, 'path');
        expect(actual).to.eql(expected);
      }

    });


  });

});
