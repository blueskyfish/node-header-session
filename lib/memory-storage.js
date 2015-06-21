/*!
 * Project: node-rest-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * MemoryStorage load and store session values from the memory.
 */

'use strict';

var
  Q = require('q'),
  extend = require('extend');

var
  session = require('./session');


/**
 * Default constructor initialize the cache object.
 *
 * @constructor
 */
function MemoryStorage() {

  /**
   * The cache records the session values.
   * @type {object}
   * @private
   */
  this._cache = {};
}

/**
 * Load the session values and returns the values in case of success.
 *
 * ```js
 * var
 *   token = req.get(headerName);
 *
 * storage.load(token).then(
 *   function (session) {
 *     // work with the session values and set new values or change values.
 *
 *   }
 * );
 * ```
 *
 * @param {string} token the unique token
 * @returns {promise}
 */
MemoryStorage.prototype.load = function (token) {

  var
    deferred = Q.defer(),
    session = this._getSession(token);

  session.touch();

  process.nextTick(function () {
    // resolve the session values!
    deferred.resolve(extend(false, {}, session.values()));
  });

  return deferred.promise;
};

/**
 * Stores the session values and returns in case of success the values.
 *
 * @param {string} token the unique token
 * @param values the new session values
 * @returns {promise}
 */
MemoryStorage.prototype.store = function (token, values) {
  var
    deferred = Q.defer(),
    session = this._getSession(token);

  // create a copy and set the new container...
  session.values(extend(false, {}, values));
  session.touch();

  process.nextTick(function () {
    deferred.resolve(values);
  });

  return deferred.promise;
};

/**
 * Clear the internal cache. All session values will destroy.
 */
MemoryStorage.prototype.clear = function () {
  this._cache = {};
};


MemoryStorage.prototype._getSession = function (token) {
  var
    sess = this._cache[token];

  if (!sess) {
    // ups, there is no session instance
    sess = this._cache[token] = session.createSession(token);
  }
  return sess;
};


/**
 * Returns the singleton memory storage.
 *
 * @type {MemoryStorage}
 */
module.exports = new MemoryStorage();


