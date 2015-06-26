/*!
 * Project: node-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * file helper functions
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
  utils = require('./utils');

// exports
module.exports.listFiles = _listFiles;
module.exports.fileInfo = _fileInfo;
module.exports.fileSize = _fileSize;


/**
 * Returns a list with the file informations
 * 
 * @param {String} pathname the directory for the searching
 * @param {Array|string} [blackList] the list of filenames, that not in the file list.
 * @return {Promise} in case of success a list of fileInfo objects is returns in the promise part.
 */
function _listFiles (pathname, blackList) {
  var
      deferred = Q.defer();
  
  if (!blackList) {
    blackList = [];
  }
  if (!util.isArray(blackList)) {
    blackList = [ blackList ];
  }
  
  fs.readdir(pathname, function (err, files) {
    var
      promiseList = [],
      filename;
      
    if (utils.successOrReject(err, deferred)) {
      
      files.forEach(function (file) {
        if (blackList.indexOf(file) < 0) {
          filename = path.join(pathname, file);
          promiseList.push(_fileInfo(filename));
        }
      });
      
      Q.all(promiseList).then(function (fileInfos) {
        deferred.resolve(fileInfos);
      },
      function (reason) {
        deferred.reject(reason);
      });
    }
  });
  
  return deferred.promise;
}

function  _fileInfo(filename) {
  var
    deferred = Q.defer();
    
  function __buildStatus(stat) {
    var
      status = [];
      
    if (stat.isDirectory()) status.push('d');
    if (stat.isFile()) status.push('f');
    
    return status;
  }
  
  fs.stat(filename, function (err, stat) {
    if (utils.successOrReject(err, deferred)) {
      deferred.resolve({
        name: filename,
        status: __buildStatus(stat),
        size: _fileSize(stat.size),
        creation: stat.ctime,
        modified: stat.mtime
      });
    }
  });
  
  return deferred.promise;
}

/**
 * Returns the file size in readable text
 * 
 * @param {number} bytes
 * @param {*} [si] defines the calculed base
 * @return {String} the file size in readable text
 * 
 * @see http://stackoverflow.com/a/14919494
 */
function _fileSize(bytes, si) {
  var
    thresh = si ? 1000 : 1024;
    
  if(Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var
    units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
 
}

