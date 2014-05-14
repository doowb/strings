/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');


describe('strings', function () {

  describe('caches', function () {

    describe('templates', function() {

      var strings;
      before(function () {
        strings = new Strings();
      });

      it('when adding a named template, it should be in `_templates`', function () {
        var name = 'test1';
        var template = ':foo/:baz/:basename/index:ext';
        strings.structure(name, template);
        expect(strings._templates).to.have.property(name);
        var actual = strings._templates[name];
        expect(actual).to.eql(template);
      });

      it('when adding a named template, it should be gotten through `structure(name)`', function () {
        var name = 'test2';
        var template = ':basename/index:ext';
        strings.structure(name, template);
        var actual = strings.structure(name);
        expect(actual).to.eql(template);
      });

    });

  });

});
