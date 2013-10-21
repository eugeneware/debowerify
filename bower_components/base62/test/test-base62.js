var expect, base62;

if (typeof module !== 'undefined') {
  expect = require('expect.js');
  base62 = require('../');
} else {
  expect = this.expect;
  base62 = this.base62;
}

describe('base62', function() {

  describe('#createConverter()', function() {

    it('should return Base62 instance', function() {
      expect(base62.createConverter()).to.be.a(base62.Base62_);
    });

  });

  describe('#decode()', function() {

    it('should throw error if parameter is not a integer', function() {
      function f(v) {
        return function() {
          base62.decode(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(Error);
      }

      expect(f('')).to.throwError(fn);
      expect(f('-')).to.throwError(fn);
      expect(f('0.1')).to.throwError(fn);
    });

    it('should throw error if parameter type is not a string', function() {
      function f(v) {
        return function() {
          base62.decode(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f(1)).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(void 0)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

    it('should convert to integer from base62 string', function() {
      expect(base62.decode('0')).to.be(0);
      expect(base62.decode('Z')).to.be(61);
      expect(base62.decode('10')).to.be(62);
      expect(base62.decode('-0')).to.be(0);
      expect(base62.decode('-Z')).to.be(-61);
      expect(base62.decode('-10')).to.be(-62);
      expect(base62.decode('2lkCB1')).to.be(2147483647);
      expect(base62.decode('-2lkCB2')).to.be(-2147483648);
    });

  });

  describe('#encode()', function() {

    it('should throw error if parameter is not a integer', function() {
      function f(v) {
        return function() {
          base62.encode(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(Error);
      }

      expect(f(0.1)).to.throwError(fn);
      expect(f(NaN)).to.throwError(fn);
      expect(f(Infinity)).to.throwError(fn);
      expect(f(-Infinity)).to.throwError(fn);
    });

    it('should throw error if parameter type is not a number', function() {
      function f(v) {
        return function() {
          base62.encode(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f('a')).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(void 0)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

    it('should convert to base62 string from integer', function() {
      expect(base62.encode(0)).to.be('0');
      expect(base62.encode(61)).to.be('Z');
      expect(base62.encode(62)).to.be('10');
      expect(base62.encode(-0)).to.be('0');
      expect(base62.encode(-61)).to.be('-Z');
      expect(base62.encode(-62)).to.be('-10');
      expect(base62.encode(2147483647)).to.be('2lkCB1');
      expect(base62.encode(-2147483648)).to.be('-2lkCB2');
    });

  });

  describe('#Base62()', function() {

    it('should throw error if parameter is not a string', function() {
      function f(v) {
        return function() {
          base62.Base62_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(TypeError);
      }

      expect(f(1)).to.throwError(fn);
      expect(f(true)).to.throwError(fn);
      expect(f(null)).to.throwError(fn);
      expect(f(void 0)).to.throwError(fn);
      expect(f(function() {})).to.throwError(fn);
    });

    it('should throw error if parameter is not 62 chars', function() {
      function f(v) {
        return function() {
          base62.Base62_(v);
        };
      }

      function fn(e) {
        expect(e).to.be.a(Error);
      }

      expect(
          f('61-----------------------------------------------------------')
      ).to.throwError(fn);
      expect(
          f('63-------------------------------------------------------------')
      ).to.throwError(fn);
    });

    it('should has default table', function() {
      expect((new base62.Base62_).table_).to.be(
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    });

    it('should set another table', function() {
      var t = '62------------------------------------------------------------',
          b = new base62.Base62_(t);

      expect(b.table_).to.be(t);
    });

  });

  describe('#isInteger()', function() {

    it('should return false if parameter is not a number', function() {
      expect(base62.isInteger_('a')).to.be(false);
      expect(base62.isInteger_(true)).to.be(false);
      expect(base62.isInteger_(null)).to.be(false);
      expect(base62.isInteger_(void 0)).to.be(false);
      expect(base62.isInteger_(function() {})).to.be(false);
    });

    it('should return false if parameter is not a finite number', function() {
      expect(base62.isInteger_(NaN)).to.be(false);
      expect(base62.isInteger_(Infinity)).to.be(false);
      expect(base62.isInteger_(-Infinity)).to.be(false);
    });

    it('should return false if parameter is floating-point number', function() {
      expect(base62.isInteger_(0.1)).to.be(false);
    });

    it('should return true if parameter is integer', function() {
      expect(base62.isInteger_(0)).to.be(true);
      expect(base62.isInteger_(2147483647)).to.be(true);
      expect(base62.isInteger_(-2147483648)).to.be(true);
    });

  });

});
