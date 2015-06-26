/*!
 * Project: node-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * Some helper functions
 */

/// <reference path="../typings/tsd.d.ts" />

'use strict';

module.exports.isFunction = function (o) {
  return typeof o === 'function';
};

module.exports.isString = function (s) {
  return typeof s === 'string';
};

/**
 * Check the err parameter and in case of failed then call the reject of the deferred object.
 * 
 * @param {object} err the error object
 * @param {Deferred} deferred the deferred object
 * @return {boolean} if the err is undefined, then it return true, otherwise an error has occurred and return false.
 */
module.exports.successOrReject = function (err, deferred) {
  if (err) {
    deferred.reject(err);
    return false;
  }
  return true;
};
