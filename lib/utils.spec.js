
'use strict';

var
  chai = require('chai');

var
  utils = require('./utils');

var
  testFunc = function () {};

describe('Test "utils" library', function () {

  describe('function "isFunction"', function () {

    it('should return "true" by a function', function () {
      chai.expect(utils.isFunction(testFunc)).to.equal(true);
    });

    it('should return "false" by other values', function () {
      chai.expect(utils.isFunction(false)).to.equal(false);
      chai.expect(utils.isFunction(true)).to.equal(false);
      chai.expect(utils.isFunction('string')).to.equal(false);
      chai.expect(utils.isFunction(34)).to.equal(false);
      chai.expect(utils.isFunction(null)).to.equal(false);
      chai.expect(utils.isFunction(undefined)).to.equal(false);
    });

  });

  describe('function "isString"', function () {

    it('should return "true" by a string', function () {
      chai.expect(utils.isString('abc')).to.equal(true);
      chai.expect(utils.isString("abc")).to.equal(true);
      chai.expect(utils.isString('')).to.equal(true);
    });

    it('should return "false" by other values', function () {
      chai.expect(utils.isString(null)).to.equal(false);
      chai.expect(utils.isString(undefined)).to.equal(false);
      chai.expect(utils.isString(34)).to.equal(false);
      chai.expect(utils.isString(34.3)).to.equal(false);
      chai.expect(utils.isString({})).to.equal(false);
      chai.expect(utils.isString(new Date())).to.equal(false);
    });

  });

});