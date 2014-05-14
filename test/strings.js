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

    var strings;
    before(function () {
      strings = new Strings();
    });

    describe('templates', function() {

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

    describe('parsers', function() {

      it('when adding a named parser, it should be in `_parsers`', function () {
        var name = 'test-parser-1';
        var parser = {
          ':basename': function () {
            return 'foo';
          },
          ':ext': function () {
            return '.html';
          }
        };

        strings.parser(name, parser);
        expect(strings._parsers).to.have.property(name);
        var actual = strings._parsers[name];
        expect(actual).to.eql(parser);
      });

      it('when adding a named parser, it should be gotten through `parser(name)`', function () {
        var name = 'test-parser-2';
        var parser = {
          ':basename': function () {
            return 'foo';
          },
          ':ext': function () {
            return '.html';
          }
        };
        strings.parser(name, parser);
        var actual = strings.parser(name);
        expect(actual).to.eql(parser);
      });

      describe('strings.parsers()', function () {

        before(function () {
          strings = new Strings();

          strings.parser('objLiteralParser', {
            ':foo': 'bar'
          });

          strings.parser('objReplacementsParser', {
            pattern: ':bar',
            replacement: 'baz'
          });

          strings.parser('objReplacementsFnParser', {
            pattern: ':baz',
            replacement: function () {
              return 'bing';
            }
          });

          strings.parser('arrObjLiteralParser', [
            { ':arrFoo': 'arrBar' },
            { ':arrBar': 'arrBaz' }
          ]);

          strings.parser('arrObjReplacementsParser', [
            { pattern: ':arrBaz', replacement: 'arrBing' },
            { pattern: ':arrBing', replacement: 'arrBang' }
          ]);

          strings.parser('arrObjReplacementsFnParser', [
            { pattern: ':arrBang', replacement: function () { return 'arrBong'; } },
            { pattern: ':arrBeep', replacement: function () { return 'arrBoop'; } }
          ]);

        });

        it('when passing in a single string', function () {
          var expected = [{ pattern: ':foo', replacement: 'bar' }];
          var actual = strings.parsers('objLiteralParser');
          expect(actual).to.eql(expected);
        });

        it('when passing in an array with a single string', function () {
          var expected = [{ pattern: ':bar', replacement: 'baz' }];
          var actual = strings.parsers(['objReplacementsParser']);
          expect(actual).to.eql(expected);
        });

        it('when passing in an array with a multiple strings', function () {
          var expected = [
            { pattern: ':bar', replacement: 'baz' },
            { pattern: ':baz', replacement: function () { return 'bing'; } }
          ];
          var actual = strings.parsers(['objReplacementsParser', 'objReplacementsFnParser']);
          expect(actual.length).to.eql(expected.length);
        });

        it('when passing in an array with a multiple types', function () {
          var expected = [
            { pattern: ':bar', replacement: 'baz' },
            { pattern: ':basename', replacement: 'file' },
            { pattern: ':ext', replacement: 'ext' }
          ];
          var actual = strings.parsers([
            'objReplacementsParser',
            {
              ':basename': 'file',
              ':ext': 'ext'
            }
          ]);
          expect(actual).to.eql(expected);
        });

        it('when passing in `undefined`', function () {
          var actual = strings.parsers();
          expect(actual.length).to.eql(9);
        });


      });

    });

    describe('groups', function() {

      it('when adding a named group, it should be in `_groups`', function () {
        var name = 'test-group-1';
        var structure = 'test-structure-1';
        var parsers = ['test-parser-1', 'test-parser-2'];
        strings.group(name, structure, parsers);
        expect(strings._groups).to.have.property(name);
        var actual = strings._groups[name];
        var expected = {
          structure: structure,
          parsers: parsers
        };
        expect(actual).to.eql(expected);
      });

      it('when adding a named group, it should be gotten through `group(name)`', function () {
        var name = 'test-group-1';
        var structure = 'test-structure-1';
        var parsers = ['test-parser-1', 'test-parser-2'];
        strings.group(name, structure, parsers);
        var actual = strings.group(name);
        var expected = {
          structure: structure,
          parsers: parsers
        };
        expect(actual).to.eql(expected);
      });

    });

  });

  describe('strings.template()', function () {

    var strings;
    before(function () {
      strings = new Strings();
    });

    it('when a template is passed in', function () {
      var expected = ':basename/index:ext';
      var actual = strings.template(':basename/index:ext');
      expect(actual).to.eql(expected);
    });

    it('when a template and parser object are passed in', function () {
      var expected = 'file/index.html';
      var parser = {
        ':basename': 'file',
        ':ext': '.html'
      };
      var actual = strings.template(':basename/index:ext', parser);
      expect(actual).to.eql(expected);
    });

    it('when a template, parser object, and context are passed in', function () {
      var path = require('path');
      var expected = 'file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };
      var actual = strings.template(':basename/index:ext', parser, context);
      expect(actual).to.eql(expected);
    });

    it('when a template, named parser, and context are passed in', function () {
      var path = require('path');
      var expected = 'file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };

      strings.parser('path', parser);
      var actual = strings.template(':basename/index:ext', 'path', context);
      expect(actual).to.eql(expected);
    });

  });

  describe('strings.process()', function () {

    var strings;
    before(function () {
      strings = new Strings();
      strings.structure('pretty', ':basename/index:ext');
    });

    it('when a structure is passed in', function () {
      var expected = ':basename/index:ext';
      var actual = strings.process('pretty');
      expect(actual).to.eql(expected);
    });

    it('when a structure and parser object are passed in', function () {
      var expected = 'file/index.html';
      var parser = {
        ':basename': 'file',
        ':ext': '.html'
      };
      var actual = strings.process('pretty', parser);
      expect(actual).to.eql(expected);
    });

    it('when a structure, parser object, and context are passed in', function () {
      var path = require('path');
      var expected = 'file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };
      var actual = strings.process('pretty', parser, context);
      expect(actual).to.eql(expected);
    });

    it('when a structure, named parser, and context are passed in', function () {
      var path = require('path');
      var expected = 'file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };

      strings.parser('path', parser);
      var actual = strings.process('pretty', 'path', context);
      expect(actual).to.eql(expected);
    });

  });

  describe('strings.run()', function () {

    var strings;
    before(function () {
      strings = new Strings();
      strings.structure('pretty', ':basename/index:ext');
    });

    it('when a group without a parser object is passed in', function () {
      var expected = ':basename/index:ext';
      strings.group('blog', 'pretty');
      var actual = strings.run('blog');
      expect(actual).to.eql(expected);
    });

    it('when a group with a parser object are passed in', function () {
      var expected = 'file/index.html';
      var parser = {
        ':basename': 'file',
        ':ext': '.html'
      };
      strings.group('blog', 'pretty', parser);
      var actual = strings.run('blog');
      expect(actual).to.eql(expected);
    });

    it('when a group with a parser object, and context are passed in', function () {
      var path = require('path');
      var expected = 'file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };
      strings.group('blog', 'pretty', parser);
      var actual = strings.run('blog', context);
      expect(actual).to.eql(expected);
    });

    it('when a group with a named parser, and context are passed in', function () {
      var path = require('path');
      var expected = 'file/index.html';
      var parser = {
        ':basename': function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        },
        ':ext': function () {
          return path.extname(this.filepath);
        }
      };
      var context = {
        filepath: 'path/to/my/file.html'
      };

      strings.parser('path', parser);
      strings.group('blog', 'pretty', 'path');
      var actual = strings.run('blog', context);
      expect(actual).to.eql(expected);
    });

  });

});
