/*!
 * Project: node-rest-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * Simple generate and validate a unique token
 */

'use strict';

var
  PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[0-9a-f]{8}-[0-9a-f]{4}$/g;


module.exports.generate = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

module.exports.validate = function (token) {
  return PATTERN.test(token);
};
