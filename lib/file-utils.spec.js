
'use strict';

var
  util = require('util');
  
var
  expect = require('chai').expect;

var
  fileUtils = require('./file-utils');

describe('Test "file-utils" Library', function () {
  
  describe('When request the file information', function () {
    
    it('Should return a list of file informations (blacklist is not defined)', function (done) {
      
      fileUtils.listFiles('lib').then(function (fileInfos) {
        expect(util.isArray(fileInfos)).to.true;
        done();
      },
      function (reason) {
        console.log('error: ', reason);
        done();
      });
      
    });
    
    it('Should return a list of file informations (blacklist is empty)', function (done) {
      
      fileUtils.listFiles('lib', []).then(function (fileInfos) {
        expect(util.isArray(fileInfos)).to.true;
        done();
      },
      function (reason) {
        console.log('error: ', reason);
        done();
      });
      
    });
    
    it ('Should return a filtered list of file informations', function (done) {
      
      function contains(fileInfos, filename) {
        var
          found = false;
        
          
        fileInfos.forEach(function (info) {
          if (found === false && info.name === filename) {
            found = true;
          }
        });
        return found;
      }
      
      fileUtils.listFiles('lib', ['file-utils.spec.js']).then(function (fileInfos) {
        expect(util.isArray(fileInfos)).to.true;
        expect(contains(fileInfos, 'lib/file-utils.spec.js')).to.equal(false);
        expect(contains(fileInfos, 'lib/file-utils.js')).to.equal(true);
        done();        
      },
      function (reason) {
          console.log('error: ', reason);
          done();
      });
    });
  });
  
  describe('When directory is not exists', function () {
    
    it ('Should returns an error', function (done) {
      
      fileUtils.fileInfo('brutzlist').then(
        function (fileInfos) {
          expect(true).to.false;
          done();
        },
        function (reason) {
          expect(reason).not.undefined;
          done();
        }
      );
    });
  });
  
  describe('When convert file size in readable text', function () {
    
    it('should return text', function () {
      var
        text;
      
      text = fileUtils.fileSize(23000, true);
      expect(text).to.be.a('string');
      expect(text).to.equal('23.0 kB');
      
      text = fileUtils.fileSize(23000);
      expect(text).to.be.a('string');
      expect(text).to.equal('22.5 KiB');
    });
  });
  
  describe('When get the file information from a give file', function () {
    
    it('Should returns the information, if the file exists', function (done) {
      var
        filename = 'lib/file-utils.js';
        
      fileUtils.fileInfo(filename).then(
        function (info) {
          expect(info).not.undefined;
          expect(info).has.property('name');
          expect(info).has.property('size');
          expect(info).has.property('status');
          expect(info).has.property('creation');
          expect(info).has.property('modified');
          done();
        }
      );
    });
    
    it('Should returns an error if the file is not exists', function (done) {
      var
        filename = 'is/not/knowing.txt';
      
      fileUtils.fileInfo(filename).then(
        null,
        function (reason) {
          expect(reason).not.undefined;
          done();
        }
      )
    })
  });
});
