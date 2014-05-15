/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;

var Strings = require('../');
var urls = require('../parsers').urls;

describe('parser', function() {
  describe('urls', function() {

    var url = 'https://github.com/sellside/strings.git?sortby=name';
    var strings = null;

    before(function(){
      strings = new Strings();
      strings.parser('urls', urls());
    });

    it('should replace :protocol', function() {
      var expected = 'https:';
      var actual = strings.template(':protocol', 'urls', {url: url});
      expect(actual).to.eql(expected);
    });

  });

});
