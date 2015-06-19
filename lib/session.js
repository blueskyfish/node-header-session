/*!
 *
 */

/**
 * @param {string} token
 * @constructor
 */
function Session(token) {
	this._token = token;
	this._creation = new Date();
	this._modified = this._creation;
	this._values = {};
}

Session.prototype.values = function (values) {
	if (!values) {
		return this._values;
	}
	this._values = values;
};

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


module.exports = Session;
