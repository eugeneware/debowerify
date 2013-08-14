var expect = require('chai').expect,
    browserify = require('browserify'),
    vm = require('vm'),
    path = require('path'),
    debowerify = require('..'),
    fs = require('fs');

describe('debowerify', function() {
  it('should be able to debowerify a basic file', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'index.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal('hello, world');
            done();
          }
        }
      });
    });
  });
});
