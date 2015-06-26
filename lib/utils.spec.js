
'use strict';

var
  expect = require('chai').expect,
  Q = require('q');

var
  utils = require('./utils');

var
  testFunc = function () {};

describe('Test "utils" library', function () {

  describe('When test the function "isFunction"', function () {

    it('Should return "true" by a function', function () {
      expect(utils.isFunction(testFunc)).to.be.true;
    });

    it('Should return "false" by other values', function () {
      expect(utils.isFunction(false)).to.be.false;
      expect(utils.isFunction(true)).to.be.false;
      expect(utils.isFunction('string')).to.be.false;
      expect(utils.isFunction(34)).to.be.false;
      expect(utils.isFunction(null)).to.be.false;
      expect(utils.isFunction(undefined)).to.be.false;
    });

  });

  describe('When test the function "isString"', function () {

    it('Should return "true" by a string', function () {
      expect(utils.isString('abc')).to.be.true;
      expect(utils.isString("abc")).to.be.true;
      expect(utils.isString('')).to.be.true;
    });

    it('Should return "false" by other values', function () {
      expect(utils.isString(null)).to.be.false;
      expect(utils.isString(undefined)).to.be.false;
      expect(utils.isString(34)).to.be.false;
      expect(utils.isString(34.3)).to.be.false;
      expect(utils.isString({})).to.be.false;
      expect(utils.isString(new Date())).to.be.false;
    });

  });
  
  describe('When test the function "successOrReject"', function () {
    
    it ('Should return false in case of error', function (done) {
      var
        err = {},
        deferred = Q.defer();
        
      setTimeout(function () {
        expect(utils.successOrReject(err, deferred)).to.be.false;
      }, 10);
      
      deferred.promise.then(
        null,
        function (reason) {
          expect(reason).to.equal(err);
          done();
        }
      );
    });
    
    it('Should return true in case of success', function (done) {
      
      var
        err = undefined,
        deferred = Q.defer();
        
        setTimeout(function () {
          expect(utils.successOrReject(err, deferred)).to.be.true;
          deferred.resolve(true);
        });
        
        deferred.promise.then(
          function (result) {
            expect(result).to.be.true;
            done();
          }
        );
    });
  });

});