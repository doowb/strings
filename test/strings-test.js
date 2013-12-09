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

describe('strings', function() {

  it('should save the structure', function() {
    var expected = '/{{basename}}/index.html';
    var structure = strings(expected);
    expect(structure.structure).to.equal(expected);
  });

});