/*!
 * Project: node-rest-header-session
 */

module.exports.isFunction = function (o) {
	return typeof o === 'function';
};

module.exports.isString = function (s) {
	return typeof s === 'string';
};

module.exports.generator = function(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxyxxxx-xx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
};
