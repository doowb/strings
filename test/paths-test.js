/**
 * Sellside
 *
 * Sellside <http://www.sellside>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;

var strings = require('../');

describe('middleware', function() {

  describe('paths', function() {

  	var filePath = '/path/to/foo.html';
  	var structure = null;
  	before(function(){
  		structure = strings().use(strings.paths(filePath));
  	});
  
    it('should replace :basename', function() {
      var expected = 'foo';
      var actual = structure.run(':basename');
      expect(actual).to.eql(expected);
    });

    it('should replace :filename', function() {
      var expected = 'foo.html';
      var actual = structure.run(':filename');
      expect(actual).to.eql(expected);
    });

    it('should replace :ext', function() {
      var expected = '.html';
      var actual = structure.run(':ext');
      expect(actual).to.eql(expected);
    });

    it('should replace dir', function() {
      var expected = '/path/to';
      var actual = structure.run(':dir');
      expect(actual).to.eql(expected);
    });
  
  });

});