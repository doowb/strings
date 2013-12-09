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
var assert = require('chai').assert;

var strings = require('../');
var inspect = require('util').inspect;
var basename = require('path').basename;
var extname = require('path').extname;


var pathMiddleware = function(path) {
  return function() {
    return {
      basename: basename(path, extname(path)),
      extname: extname(path)
    };
  };
};

var excludeMiddleware = function() {
  return ['extname'];
};

var testStructure = '/<%= basename %>/index<%= extname %>';

describe('strings', function() {

  describe('structure', function() {

    it('should save the structure', function() {
      var structure = strings(testStructure);
      expect(structure.structure).to.equal(testStructure);
    });

  });

  describe('middleware', function() {

    it('should add middleware with use', function() {
      var structure = strings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      expect(structure.middleware.length).to.equal(1);
    });

    it('should add middleware with exclude', function() {
      var structure = strings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(excludeMiddleware);
      expect(structure.middleware.length).to.equal(2);
    });

    it('should build context from middleware', function() {
      var structure = strings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      var expected = {
        basename: 'file',
        extname: '.html'
      };
      var actual = structure.context();
      expect(actual).to.eql(expected);
    });

    it('should build context from middleware with exclusions', function() {
      var structure = strings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(excludeMiddleware);
      var expected = {
        basename: 'file'
      };
      var actual = structure.context();
      expect(actual).to.eql(expected);
    });

  });

  describe('run', function() {

    it('should build the final string with no exclusions', function() {
      var structure = strings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      var expected = '/file/index.html';
      var actual = structure.run();
      expect(actual).to.eql(expected);
    });

    it('should throw error with exclusions', function() {
      var structure = strings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(excludeMiddleware);
      
      assert.throw(structure.run, Error);
    });

  });

});