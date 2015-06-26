/*!
 * Project: node-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * store the session values on the filesystem
 */

/// <reference path="../typings/tsd.d.ts" />

'use strict';

var
  fs = require('fs'),
  path = require('path'),
  util = require('util');

var
  Q = require('q');

var
  utils = require('./utils'),
  fileUtils = require('./file-utils');

// constants
var
  FILE_EXT = '.json',
  FILE_ENC = 'utf-8';


var FileStorage = function () {

  this._path = '';
  
  this._blackList = [ 'readme.md' ];

};

FileStorage.prototype.init = function (options) {
  var
    deferred = Q.defer(),
    _self = this;

  setTimeout(function () {
    var
      pathName;
      
    if (!options) {
      deferred.reject('missing file-storage options');
      return;
    }
    pathName = options.storagePath;

    if (!pathName) {
      deferred.reject('missing the storagePath property');
      return;
    }
    // blacklist for the clear method...
    if (options.backlist && util.isArray(options.blacklist)) {
      _self._blackList = _self._backlist.concat(options.blacklist);
    };
    
    // check the storage path...
    fs.stat(pathName, function (err, stat) {
      if (err) {
        deferred.reject(err);
        return;
      }
      if (!stat.isDirectory()) {
        if (stat.isFile()) {
          deferred.reject('storagePath is not a directory');
          return;
        }
        deferred.reject('storagePath is not exist');
      }

      _self._path = pathName;

      deferred.resolve(pathName);
    });

  }, 10);

  return deferred.promise;
};

FileStorage.prototype.load = function (token) {
  var
    deferred = Q.defer(),
    fileName = path.join(this._path, token + FILE_EXT);

  fs.readFile(fileName, { encoding: FILE_ENC }, function (err, data) {
    if (err && err.code !== 'ENOENT') {
      deferred.reject(err);
      return;
    }
    if (err && err.code === 'ENOENT') {
      deferred.resolve({});
      return;
    }
    try {
      deferred.resolve(JSON.parse(data));
    } catch (e) {
      deferred.reject(e);
    }
  });
  return deferred.promise;
};

FileStorage.prototype.store = function (token, values) {
  var
    deferred = Q.defer(),
    fileName = path.join(this._path, token + FILE_EXT),
    data = JSON.stringify(values);

  fs.writeFile(fileName, data, { encoding: FILE_ENC }, function (err) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(values);
  });
  return deferred.promise;
};

FileStorage.prototype.info = function () {
  var
    pathname = this._path;

  return fileUtils.listFiles(pathname, this._blacklist);
};

FileStorage.prototype.clear = function () {
  var
    pathname = this._path;
  
  return fileUtils.listFiles(pathname, this._blacklist).then(function (fileInfos) {
    fileInfos.forEach(function (info) {
      if (path.extname(info.name) === FILE_EXT) {
        fs.unlinkSync(info.name);
      }
    });
    return true;
  });
};


module.exports = new FileStorage();
