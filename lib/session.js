/*!
 * Project: node-rest-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * A item has the session values and internal meta information (creation, modified, token)
 */

'use strict';


/**
 * @param {string} token
 * @constructor
 */
function Session(token) {
	this._token = token;

  /**
   * The creation date
   * @type {Date}
   * @private
   */
	this._creation = new Date();

  /**
   * The modified or last access date
   * @type {Date}
   * @private
   */
	this._modified = this._creation;

  /**
   * The session container
   * @type {object}
   * @private
   */
	this._values = {};
}

/**
 * Get or set the session container.
 *
 * @param {object} [values] if the parameter is present, then the new value will be setting.
 *
 * @returns {object}
 */
Session.prototype.values = function (values) {
	if (values) {
    this._values = values;
	}
  return this._values;
};

/**
 * Update the modified date.
 */
Session.prototype.touch = function () {
	this._modified = new Date();
};

Session.prototype.token = function () {
	return this._token;
};

Session.prototype.creation = function () {
	return this._creation;
};

Session.prototype.modified = function () {
	return this._modified;
};

/**
 * Creates a new session with the given token.
 *
 * @param {string} token the unique token
 * @returns {Session}
 */
module.exports.createSession = function (token) {
  return new Session(token);
};
