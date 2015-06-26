


/// </// <reference path="../typings/tsd.d.ts" />

'use strict';

var
  fs = require('fs');
  
var
  expect = require('chai').expect;

describe('Test "FileStorage" class', function () {

  var
    storage = require('./file-storage');
  
  afterEach(function () {
    storage.clear();
  });
  
  describe('When options is missing and / or undefined', function () {
        
    it('Should raise an error (missing)', function (done) {
      storage.init().then(
        null,
        function (reason) {
          expect(reason).to.equal('missing file-storage options');
          done();          
        }
      );
    });
    
    it('Should raise an error (undefined)', function (done) {
      var
        options;
        
      storage.init(options).then(
        null,
        function (reason) {
          expect(reason).to.equal('missing file-storage options');
          done();          
        }
      );
    });
    
    it('Should raise an error (null)', function (done) {
      var
        options = null;
        
      storage.init(options).then(
        null,
        function (reason) {
          expect(reason).to.equal('missing file-storage options');
          done();          
        }
      );
    });
  });
  
  describe('When property "storagePath" is not defined or Wrong', function () {
    
    it('Should throw an error (missing)', function (done) {
      var
        options = {};
        
      storage.init(options).then(
        function () {
          expect(false).to.equal(true);
          done();
        },
        function (reason) {
          expect(reason).to.equal('missing the storagePath property');
          done();
        }
      );
    });
    
    it('Should throw an error (path is not exist)', function (done) {
      var
        options = {
          storagePath: 'blubBlub/test/www'
        };
        
      storage.init(options).then(
        null,
        function (reason) {
          expect(reason).not.undefined;
          done();
        }
      );
    });
  });
  
  describe('should init success the storage', function () {
          
    it('when define the storagePath', function (done) {
      var
        options = {
          storagePath: 'test/file-storage'
        };
      
      storage.init(options).then(function (pathname) {
        expect(pathname).to.equal('test/file-storage');
        done();
      });
    });
    
  });
  
  describe('When read and write to the file storage', function () {
    
    beforeEach(function (done) {
      var
        options = {
          storagePath: 'test/file-storage'
        };
      
      storage.init(options).then(function (pathname) {
        expect(pathname).to.equal('test/file-storage');
        done();
      });
    });
    
    it('Should write the session values and the file is exist', function (done) {
      var
        session = {
          count: 34,
          name: 'Test'
        };
      
      storage.store('write-token', session).then(
        function (values) {
          expect(values).to.equal(session);
          expect(fs.existsSync('test/file-storage/write-token.json')).to.equal(true);
          done();
        }
      );
    });
    
    it('Should try to read an not existing session values and empty session values is return', function (done) {
      
      storage.load('read-not-exist-file').then(
        function (session) {
          expect(session).not.undefined;
          done();
        }
      );
    });
    
    it('Should write a session values and try to read the values and returns the values', function (done) {
      
      var
        session = {
          count: 34,
          name: 'Test'
        };
      
      storage.store('write-and-read', session).then(
        function (values) {
          expect(values).to.equal(session);
          expect(fs.existsSync('test/file-storage/write-and-read.json')).to.equal(true);
          
          
          storage.load('write-and-read').then(
            function (values) {
              expect(values).not.undefined;
              expect(values.count && values.count === 34).to.equal(true);
              expect(values.name && values.name === 'Test').to.equal(true);
              done();
            }
          );
        }
      );
      
    });
  });
});