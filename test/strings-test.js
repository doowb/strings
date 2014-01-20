/**
 * Sellside
 *
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

var basename = require('path').basename;
var extname = require('path').extname;
var inspect = require('util').inspect;
var expect = require('chai').expect
var assert = require('chai').assert;
var slice = Array.prototype.slice;
var meld = require('meld');
var _ = require('lodash');

var utils = require('./utils');
utils.logging = false;

var advices = {
  before: function () {
    utils.log('Called with: ' + Array.prototype.join.call(arguments));
  }
};

var strings = meld(require('../'), advices);
var Strings = meld(require('../lib/strings'), advices);
var getStrings = function (structure, options) {
    if (utils.logging) {
      var args = [Strings].concat(slice.call(arguments));
      return utils.create(args);
    }
    return strings(structure, options);
  };

var pathMiddleware = function (path) {
    return function () {
      return {
        basename: basename(path, extname(path)),
        ext: extname(path)
      };
    };
  };

var excludeMiddleware = function () {
    return ['ext'];
  };

var testStructure = '/:basename/index:ext';


describe('strings', function () {

  describe('structure', function () {

    it('should save the structure', function () {
      var structure = getStrings(testStructure);
      expect(structure.structure).to.equal(testStructure);
    });

    it('should have an empty structure', function () {
      var structure = getStrings();
      expect(structure.structure).to.equal('');
    });

    it('should have an empty structure when options are passed in', function () {
      var structure = getStrings({});
      expect(structure.structure).to.equal('');
    });

    it('should save the structure when options are passed in', function () {
      var structure = getStrings(testStructure, {});
      expect(structure.structure).to.equal(testStructure);
    });

  });

  describe('middleware', function () {

    it('should add middleware with use', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      expect(structure.middleware.length).to.equal(1);
    });

    it('should add middleware with exclude', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(excludeMiddleware);
      expect(structure.middleware.length).to.equal(2);
    });

    it('should build context from middleware', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      var expected = {
        basename: 'file',
        ext: '.html'
      };
      var actual = structure.context();
      expect(actual).to.eql(expected);
    });

    it('should build context from middleware with exclusions', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(excludeMiddleware);
      var expected = {
        basename: 'file'
      };
      var actual = structure.context();
      expect(actual).to.eql(expected);
    });

    it('should add middleware with use as object', function () {
      var structure = getStrings(testStructure);
      structure.use({
        foo: 'bar'
      });
      expect(structure.middleware.length).to.equal(1);
    });

    it('should add middleware with exclude as object', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude({
        basename: ''
      });
      expect(structure.middleware.length).to.equal(2);
    });

    it('should add middlware with exclude as array', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(['basename']);
      expect(structure.middleware.length).to.equal(2);
    });


  });

  describe('run', function () {

    it('should build the final string with no exclusions', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      var expected = '/file/index.html';
      var actual = structure.run();
      expect(actual).to.eql(expected);
    });

    it('should build the final string with exclusions', function () {
      var structure = getStrings(testStructure);
      structure.use(pathMiddleware('path/to/some/file.html'));
      structure.exclude(excludeMiddleware);

      var expected = '/file/index:ext';
      var actual = structure.run();
      expect(actual).to.eql(expected);
    });

    it('should build the final string from a one time setup', function () {
      var structure = getStrings();
      structure.use(pathMiddleware('path/to/some/file.html'));

      var expected = 'file';
      var actual = structure.run(':basename');
      expect(actual).to.eql(expected);

      expected = '.html';
      actual = structure.run(':ext');
      expect(actual).to.eql(expected);
    });

  });

});