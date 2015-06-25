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

var
  IS_DEBUG = false;


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

  if (IS_DEBUG) console.log('storage load: touch the session %s', token);
  setTimeout(function () {
    var
      sessValues = session.values();
    // resolve the session values!
    if (IS_DEBUG) console.log('storage load: resolve session from %s\n', token, sessValues);
    deferred.resolve(sessValues);
  }, 10);

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
    session = this._getSession(token),
    sessValues = values;

  // create a copy and set the new container...
  session.values(sessValues);
  session.touch();
  if (IS_DEBUG) console.log('storage store: save the session %s\n', token, sessValues);
  setTimeout(function () {
    if (IS_DEBUG) console.log('storage store: resolve session from %s', token);
    deferred.resolve(sessValues);
  }, 10);

  return deferred.promise;
};

/**
 * Clear the internal cache. All session values will destroy.
 */
MemoryStorage.prototype.clear = function () {
  this._cache = {};
};

MemoryStorage.prototype.info = function () {
  var
    deferred = Q.defer(),
    _self = this;
  
  setTimeout(function () {
    
    var
      token,
      session,
      sessionInfoList = [];
      
      for (token in _self._cache) {
        if (!_self._cache.hasOwnProperty(token)) {
          continue;
        }
        session = _self._cache[token];
        if (!session) {
          continue;
        }
        sessionInfoList.push({
          token: token,
          creation: session.creation(),
          modified: session.modified()
        });
      }
      
      if (IS_DEBUG) console.log('info found %s sessions', sessionInfoList.length);
      
      deferred.resolve(sessionInfoList);
    
  }, 10);
  
  return deferred.promise;
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


