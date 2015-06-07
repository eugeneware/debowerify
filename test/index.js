var expect = require('chai').expect,
    browserify = require('browserify'),
    vm = require('vm'),
    path = require('path'),
    debowerify = require('..'),
    fs = require('fs');

describe('debowerify', function() {

  it('should be able to debowerify a basic file from dependencies', function(done) {
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

  it('should be able to debowerify a basic file from devDependencies', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'base62test.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal(12345);
            done();
          }
        }
      });
    });
  });

  it('should be able to debowerify a submodule', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'by_subpath.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal(12345);
            done();
          }
        }
      });
    });
  });

  it('should be able to debowerify a module with other dependencies', function(done) {
    var b = browserify();
    b.add(path.join(__dirname, '..', 'public', 'deep_dependencies_test.js'));
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src);
      done();
    });
  });

  it('should be able to debowerify a module with multiple main entries', function(done) {
    var b = browserify();
    b.add(path.join(__dirname, '..', 'public', 'multiple_main_entries.js'));
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      var sandbox = { count: 0 };
      vm.runInNewContext(src, sandbox);
      expect(sandbox.count).to.equal(6);
      done();
    });
  });

  it('should be able to debowerify a module with a broken `main` section with overrides', function(done) {
    var b = browserify();
    b.add(path.join(__dirname, '..', 'public', 'overrides.js'));
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      var sandbox = { loaded: false };
      vm.runInNewContext(src, sandbox);
      expect(sandbox.loaded).to.equal(true);
      done();
    });
  });

  it('should be able to use NODE_ENV to choose which file to debowerify', function(done) {
    process.env.NODE_ENV = 'production'
    var b = browserify();
    b.add(path.join(__dirname, '..', 'public', 'overrides2.js'));
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      var sandbox = { minified: null, notMinified: null };
      vm.runInNewContext(src, sandbox);
      expect(sandbox.minified).to.equal(true);
      expect(sandbox.notMinified).to.equal(null);
      done();
    });
  });
});
