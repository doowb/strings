/**
 * Sellside
 *
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect
var strings = require('../');
var inspect = require('util').inspect;
var basename = require('path').basename;
var extname = require('path').extname;

describe('strings', function() {

  describe('structure', function() {

    it('should save the structure', function() {
      var expected = '/{{basename}}/index.html';
      var structure = strings(expected);
      expect(structure.structure).to.equal(expected);
    });

  });

  describe('middleware', function() {

    it('should add middleware with use', function() {
      var middleware = function(path) {
        return function() {
          return {
            basename: basename(path)
          };
        };
      };

      var expected = '/{{basename}}/index.html';
      var structure = strings(expected);
      structure.use(middleware('path/to/some/file.html'));

      expect(structure.middleware.length).to.equal(1);

    });

    it('should add middleware with exclude', function() {
      var middleware = function(path) {
        return function() {
          return {
            basename: basename(path),
            extname: extname(path)
          };
        };
      };

      var exclude = function() {
        return ['extname'];
      };

      var expected = '/{{basename}}/index.html';
      var structure = strings(expected);
      structure.use(middleware('path/to/some/file.html'));
      structure.use(exclude);

      expect(structure.middleware.length).to.equal(2);

    });

  });
});