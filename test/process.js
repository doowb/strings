/**
 * Strings <https://github.com/assemble/strings>
 *
 * Copyright (c) 2014 Sellside, Jon Schlinkert and Brian Woodward
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var expect = require('chai').expect;
var Strings = require('../');


describe('.template', function () {

  var strings;
  before(function () {
    strings = new Strings();
    strings.propstring('pathProps', ':destbase/:dirname/:basename/index:ext');
    strings.parser('parsePath', [
      {
        pattern: ':destbase',
        replacement: function () {
          return this.destbase;
        }
      },
      {
        pattern: ':dirname',
        replacement: function () {
          return path.dirname(this.src);
        }
      },
      {
        pattern: ':basename',
        replacement: function () {
          return path.basename(this.src, path.extname(this.src));
        },
      },
      {
        pattern: ':ext',
        replacement: function () {
          return path.extname(this.src);
        }
      }
    ]);
    strings.template('permalinks', 'pathProps', ['parsePath']);
  });


  describe('when no context is passed', function () {
    it('should process the propstring with an array of parsers', function () {
      strings.parser('a', {'{foo}': 'AAA'});
      strings.parser('b', {'{bar}': 'BBB'});
      strings.parser('c', {'{baz}': 'CCC'});
      var actual = strings.process('{foo}/{bar}/{baz}', ['a', 'b', 'c']);
      expect(actual).to.eql('AAA/BBB/CCC');
    });
  });


  describe('when a context is passed', function () {
    it('should process the propstring with an array of parsers', function () {
      strings.parser('a', {'{foo}': function() {
        return this.alpha.toUpperCase();
      }});
      strings.parser('b', {'{bar}': function() {
        return this.beta.toUpperCase();
      }});
      strings.parser('c', {'{baz}': function() {
        return this.gamma.toUpperCase();
      }});
      var ctx = {
        alpha: 'aaa',
        beta: 'bbb',
        gamma: 'ccc'
      };
      var actual = strings.process('{foo}/{bar}/{baz}', ['a', 'b', 'c'], ctx);
      expect(actual).to.eql('AAA/BBB/CCC');
    });
  });


  describe('when the name of a stored template is passed', function () {
    it('should use the propstring and parsers from the template with the given context', function () {
      var actual = strings.process('permalinks', {
        destbase: 'foo',
        src: 'a/b.html'
      });
      expect(actual).to.eql('foo/a/b/index.html');
    });

    it('should process the stored propstring with the given context', function () {
      var actual = strings.process('permalinks', {
        destbase: '_gh_pages',
        src: 'blog/file.html'
      });
      expect(actual).to.eql('_gh_pages/blog/file/index.html');
    });

    it('should use the propstring and parsers from the template with the given context', function () {
      var actual = strings.process('permalinks', {
        destbase: 'bar',
        src: 'a/b.html'
      });
      expect(actual).to.eql('bar/a/b/index.html');
    });
  });

  describe('when a single argument is passed:', function () {
    it('should throw an error', function () {
      var actual;
      try {
        strings.process(':basename/index:ext');
      } catch(err) {
        actual = err;
      }
      expect(/Error/.test(actual)).to.be.true;
    });
  });

  describe('when a template...:', function () {
    describe('and parser object are passed:', function () {
      it('should replace propstrings with the parser', function () {
        var actual = strings.process(':basename/index:ext', {
          ':basename': 'file',
          ':ext': '.html'
        });
        expect(actual).to.eql('file/index.html');
      });
    });

    describe('and parser object and context are passed:', function () {
      it('should replace propstrings with the parser using the given context', function () {
        var parser = [
          {
            pattern: ':basename',
            replacement: function () {
              return path.basename(this.filepath, path.extname(this.filepath));
            }
          },
          {
            pattern: ':ext',
            replacement: function () {
              return path.extname(this.filepath);
            }
          }
        ];

        var actual = strings.process(':basename/index:ext', parser, {
          filepath: 'path/to/my/file.html'
        });
        expect(actual).to.eql('file/index.html');
      });
    });
  });


  it('when a template, parser object, and context are passed', function () {
    var parser = [
      {
        pattern: /:basename/,
        replacement: function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        }
      },
      {
        pattern: /:ext/,
        replacement: function () {
          return path.extname(this.filepath);
        }
      }
    ]
    var actual = strings.process(':basename/index:ext', parser, {
      filepath: 'path/to/my/file.html'
    });
    expect(actual).to.eql('file/index.html');
  });

  it('when a template, parser object, and context are passed', function () {
    var parser = [
      {
        pattern: /\{basename}/,
        replacement: function () {
          return path.basename(this.filepath, path.extname(this.filepath));
        }
      },
      {
        pattern: /\{ext}/,
        replacement: function () {
          return path.extname(this.filepath);
        }
      }
    ];
    var actual = strings.process('{basename}/index{ext}', parser, {
      filepath: 'path/to/my/file.html'
    });
    expect(actual).to.eql('file/index.html');
  });

  it('when a template, parser object, and context are passed', function () {
    var parser = {
      ':basename': function () {
        return path.basename(this.filepath, path.extname(this.filepath));
      },
      ':ext': function () {
        return path.extname(this.filepath);
      }
    };
    var actual = strings.process(':basename/index:ext', parser, {
      filepath: 'path/to/my/file.html'
    });
    expect(actual).to.eql('file/index.html');
  });

  it('when a template, named parser, and context are passed', function () {
    strings.parser('path', {
      ':basename': function () {
        return path.basename(this.filepath, path.extname(this.filepath));
      },
      ':ext': function () {
        return path.extname(this.filepath);
      }
    });
    var actual = strings.process(':basename/index:ext', 'path', {
      filepath: 'path/to/my/file.html'
    });
    expect(actual).to.eql('file/index.html');
  });



  describe('when a named propstring and parser object are defined', function () {
    it('should get the propstring and parse it.', function () {
      var actual = strings.process('{a}/{b}', {
        '{a}': 'foo',
        '{b}': 'bar'
      });
      expect(actual).to.eql('foo/bar');
    });
  });


  describe('when a parser has replacement functions', function () {
    describe('when fallback values are defined in the functions', function () {
      it('should use the fallbacks when a value is not on the context', function () {
        strings.parser('nonsensical', [
          {
            pattern: /\{a}/g,
            replacement: function () {
              return this.a || '__UNKNOWN_A__';
            }
          },
          {
            pattern: /\{b}/g,
            replacement: function () {
              return this.b || '__UNKNOWN_B__';
            }
          },
          {
            pattern: /\{c}/g,
            replacement: function () {
              return this.c || '__UNKNOWN_C__';
            }
          }
        ]);

        var actual = strings.process('{a}/{b}/{c}', 'nonsensical', {a: 'foo', c: 'bar'});
        expect(actual).to.eql('foo/__UNKNOWN_B__/bar');
      });
    });
  });

  describe('when a propstrings are defined but a value is missing on the context', function () {
    it('should just return the actual propstring in the result.', function () {
      var parser = {
        '{base}': function () {
          return this.base;
        },
        '{name}': function () {
          return this.name;
        },
        '{ext}': function () {
          return this.ext;
        }
      };

      strings.template('permalink', '{base}/{dirname}/{name}/index{ext}', parser);
      var actual = strings.process('permalink', {
        base: '_gh_pages',
        name: 'blog',
        ext: '.html'
      });

      expect(actual).to.eql('_gh_pages/{dirname}/blog/index.html');
    });
  });


  it('when a propstring and parser object are passed', function () {
    var actual = strings.process(':a/:b/:c/index:d', {':c': 'file', ':d': '.html'});
    expect(actual).to.eql(':a/:b/file/index.html');
  });

  describe('when a propstring, parser object, and context are passed:', function () {
    it('should process the string with the given context.', function () {
      var parser = {
        ':c': function () {
          return path.basename(this.foo, path.extname(this.foo));
        },
        ':d': function () {
          return path.extname(this.foo);
        },
        ':a': function () {
          return this.destbase;
        }
      };
      var actual = strings.process(':a/:b/:c/index:d', parser, {
        foo: 'path/to/my/file.html',
        destbase: '_gh_pages'
      });
      expect(actual).to.eql('_gh_pages/:b/file/index.html');
    });
  });

  describe('when a default value is passed the parser', function () {
    it('should be used if it\'s not on the context', function () {
      var parser = {
        ':c': function () {
          return path.basename(this.foo, path.extname(this.foo));
        },
        ':d': function () {
          return path.extname(this.foo);
        },
        ':a': function () {
          return this.destbase || '.';
        }
      };

      strings.parser('path', parser);
      var actual = strings.process(':a/:b/:c/index:d', 'path', {
        foo: 'path/to/my/file.html'
      });
      expect(actual).to.eql('./:b/file/index.html');
    });
  });

});
