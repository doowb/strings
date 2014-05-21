/**
 * Sellside <http://www.sellside.com>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Sellside.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var Strings = require('../');

describe('.propstring()', function() {
  var strings = new Strings();
  describe('when a propstring is propstring()', function() {
    it('should be stored by Strings on the `_template` object:', function () {
      var name = 'test1';
      var template = ':foo/:baz/:basename/index:ext';
      strings.propstring(name, template);
      var actual = strings._templates[name];
      expect(strings._templates).to.have.property(name);
      expect(actual).to.eql(template);
    });

    it('should be retrievable using `propstring(name)`', function () {
      var name = 'test2';
      var template = ':basename/index:ext';
      strings.propstring(name, template);
      var actual = strings.propstring(name);
      expect(template).to.eql(template);
    });
  });
});

describe('.parser() - add', function() {
  var strings = new Strings();
  describe('when a named parser is defined', function() {
    it('should replace values with strings', function () {
      var name = 'test-parser-1';
      var actual = {
        ':basename': 'foo',
        ':ext': '.html'
      };
      strings.parser(name, actual);
      expect(strings._parsers).to.have.property(name);
      expect(actual).to.eql(strings._parsers[name]);
    });

    it('should replace values with functions', function () {
      var name = 'test-parser-1';
      var actual = {
        ':basename': function () {
          return 'foo';
        },
        ':ext': function () {
          return '.html';
        }
      };

      strings.parser(name, actual);
      expect(strings._parsers).to.have.property(name);
      expect(actual).to.eql(strings._parsers[name]);
    });
  });
});

describe('.parser() - get', function() {
  var strings = new Strings();
  describe('when only one paramter is passed', function() {
    it('it should retrieve the stored parser with the given name', function () {
      var name = 'test-parser-2';
      var actual = {
        ':basename': function () {
          return 'foo';
        },
        ':ext': function () {
          return '.html';
        }
      };
      strings.parser(name, actual);
      expect(actual).to.eql(strings.parser(name));
    });
  });
});


describe('.parsers() -list', function () {
  var strings;
  before(function () {
    strings = new Strings();
    strings.parser('objLiteralParser', {':foo': 'bar'});
    strings.parser('objReplacementsParser', {pattern: ':bar', replacement: 'baz'});
    strings.parser('objReplacementsFnParser', {pattern: ':baz', replacement: function () {return 'bing';}});
    strings.parser('arrObjLiteralParser', [{ ':arrFoo': 'arrBar' }, { ':arrBar': 'arrBaz' }]);
    strings.parser('arrObjReplacementsParser', [
      { pattern: ':arrBaz', replacement: 'arrBing' },
      { pattern: ':arrBing', replacement: 'arrBang' }
    ]);
    strings.parser('arrObjReplacementsFnParser', [
      { pattern: ':arrBang', replacement: function () { return 'arrBong'; } },
      { pattern: ':arrBeep', replacement: function () { return 'arrBoop'; } }
    ]);
  });

  describe('when passing in a single string as a replacement', function () {
    it('should parse and return the modified string', function () {
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
      var actual = strings.parsers(['objReplacementsParser', {':basename': 'file', ':ext': 'ext'}]);
      expect(actual).to.eql(expected);
    });

    it('when passing in `undefined`', function () {
      var actual = strings.parsers();
      expect(actual.length).to.eql(9);
    });
  });
});

describe('.group()', function() {
  var strings;
  before(function () {
    strings = new Strings();
  });

  it('when adding a named group, it should be in `_groups`', function () {
    var name = 'a';
    var propstring = 'b';
    var parsers = ['a', 'b'];
    var expected = {propstring: propstring, parsers: parsers};

    strings.group(name, propstring, parsers);

    expect(strings._groups).to.have.property(name);
    expect(expected).to.eql(strings._groups[name]);
  });

  it('when adding a named group, it should be gotten through `group(name)`', function () {
    var name = 'a';
    var propstring = 'b';
    var parsers = ['a', 'b'];
    var actual = strings.group(name);
    var expected = {propstring: propstring, parsers: parsers};

    strings.group(name, propstring, parsers);
    expect(expected).to.eql(strings.group(name));
  });
});

describe('.template()', function () {

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

describe('.process()', function () {

  var strings;
  before(function () {
    strings = new Strings();
    strings.propstring('pretty', ':basename/index:ext');
  });

  it('when a propstring is passed in', function () {
    var expected = ':basename/index:ext';
    var actual = strings.process('pretty');
    expect(actual).to.eql(expected);
  });

  it('when a propstring and parser object are passed in', function () {
    var expected = 'file/index.html';
    var parser = {
      ':basename': 'file',
      ':ext': '.html'
    };
    var actual = strings.process('pretty', parser);
    expect(actual).to.eql(expected);
  });

  it('when a propstring, parser object, and context are passed in', function () {
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

  it('when a propstring, named parser, and context are passed in', function () {
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

describe('.run()', function () {

  var strings;
  before(function () {
    strings = new Strings();
    strings.propstring('pretty', ':basename/index:ext');
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
