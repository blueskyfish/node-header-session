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

/**
 * @constructor
 */
function FileStorage () {

  this._path = '';
  
  this._blacklist = [ 'readme.md' ];

};

FileStorage.prototype.init = function (options) {
  var
    deferred = Q.defer(),
    pathName,
    $that = this;
      
  if (!options) {
    setTimeout(function () {
      deferred.reject('missing file-storage options');
    });
    return deferred.promise;
  }
  pathName = options.storagePath;

  if (!pathName) {
    setTimeout(function () {
      deferred.reject('missing the storagePath property');
    });
    return deferred.promise;
  }
  
  $that.appendBlackList(options.blacklist);
  
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

    $that._path = pathName;

    deferred.resolve(pathName);
  });

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
    
  console.log('blacklist:', this._blacklist);
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

FileStorage.prototype.appendBlackList = function (blacklist) {
  if (blacklist && util.isArray(blacklist)) {
    this._blacklist = [].concat(this._blacklist, blacklist);
    console.log('new BlackList: ', this._blacklist);
    return;
  }
  console.log('BlackList: ', this._blacklist);
};


module.exports = new FileStorage();
