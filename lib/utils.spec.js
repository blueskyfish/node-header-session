
'use strict';

var
  chai = require('chai'),
  Q = require('q');

var
  utils = require('./utils');

var
  testFunc = function () {};

describe('Test "utils" library', function () {

  describe('When test the function "isFunction"', function () {

    it('Should return "true" by a function', function () {
      chai.expect(utils.isFunction(testFunc)).to.equal(true);
    });

    it('Should return "false" by other values', function () {
      chai.expect(utils.isFunction(false)).to.equal(false);
      chai.expect(utils.isFunction(true)).to.equal(false);
      chai.expect(utils.isFunction('string')).to.equal(false);
      chai.expect(utils.isFunction(34)).to.equal(false);
      chai.expect(utils.isFunction(null)).to.equal(false);
      chai.expect(utils.isFunction(undefined)).to.equal(false);
    });

  });

  describe('When test the function "isString"', function () {

    it('Should return "true" by a string', function () {
      chai.expect(utils.isString('abc')).to.equal(true);
      chai.expect(utils.isString("abc")).to.equal(true);
      chai.expect(utils.isString('')).to.equal(true);
    });

    it('Should return "false" by other values', function () {
      chai.expect(utils.isString(null)).to.equal(false);
      chai.expect(utils.isString(undefined)).to.equal(false);
      chai.expect(utils.isString(34)).to.equal(false);
      chai.expect(utils.isString(34.3)).to.equal(false);
      chai.expect(utils.isString({})).to.equal(false);
      chai.expect(utils.isString(new Date())).to.equal(false);
    });

  });
  
  describe('When test the function "successOrReject"', function () {
    
    it ('Should return false in case of error', function (done) {
      var
        err = {},
        deferred = Q.defer();
        
      setTimeout(function () {
        chai.expect(utils.successOrReject(err, deferred)).to.be.false;
      }, 10);
      
      deferred.promise.then(
        null,
        function (reason) {
          chai.expect(reason).to.equal(err);
          done();
        }
      );
    });
    
    it('Should return true in case of success', function (done) {
      
      var
        err = undefined,
        deferred = Q.defer();
        
        setTimeout(function () {
          chai.expect(utils.successOrReject(err, deferred)).to.be.true;
          deferred.resolve(true);
        });
        
        deferred.promise.then(
          function (result) {
            chai.expect(result).to.be.true;
            done();
          }
        );
    });
  });

});