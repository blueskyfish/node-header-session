/*!
 * Project: node-rest-header-session
 *
 * MIT
 * Author: BlueSkyFish
 *
 * Purpose:
 * extends the request object with the headerSession object.
 */

'use strict';

// require external modules
var
  extend = require('extend');

var
  utils = require('./utils'),
  generator = require('./generator');

// constants
var
  HEADER_NAME = 'x-session-token';

// default options
var
  defaultOptions = {
    name: HEADER_NAME,
    debug: true,
    metricsUrl: null,
    genToken: function () {
      return generator.generate();
    },
    validToken: function (token) {
      return generator.validate(token);
    },
    storage: {} // must replace with a object with "load" and "store" method!
  };


// extends and prepares the options...
function _prepareOptions (options) {
  var
    tempOptions = extend(false, {}, defaultOptions);

  if (!options) {
    return tempOptions;
  }

  return extend(false, tempOptions, options);
}


// initialize the middleware
function _initialize(options) {

  // adjust the configuration
  var
    headerName = options.name || HEADER_NAME,
    storage = options.storage;

  if (!storage || !utils.isFunction(storage.load) || !utils.isFunction(storage.store)) {
    if (options.debug) {
      console.log('header session is using the memory storage');
    }
    storage = options.storage = require('./memory-storage');
  }

  // handle the request
  return function handleRequest(req, res, next) {

    var
      headerSession;

    if (req.headerSession) {
      if (options.debug) {
        console.log('header session is already created');
      }
      next();
      return;
    }
    // create the "headerSession" instance
    headerSession = req.headerSession = {};

    // get the token
    headerSession.token = req.get(headerName);
    if (options.debug) {
      console.log('found token: %s', headerSession.token);
    }

    if (!options.validToken(headerSession.token)) {
      // create a new token
      headerSession.token = options.genToken();

      if (options.debug) {
        console.log('create new token %s', headerSession.token);
      }
    }
    // update response header field with the token
    res.set(headerName, headerSession.token);


    headerSession.getSession = function () {
      // load the session values from the storage.
      return storage.load(headerSession.token).then(
        function (session) {

          if (options.debug) {
            console.log('load header session form %s\n', headerSession.token, session);
          }

          headerSession.session = session;

          return session; // to the next promise object.
        }
      );
    };


    // replace the response.end method...
    var
      _end = res.end;

    res.end = function (data, encoding) {
      // stores the session values and finish the request.
      storage.store(headerSession.token, headerSession.session).then(
        function (session) {

          if (options.debug) {
            console.log('store the session values from %s\n', headerSession.token, session);
          }

          _end.call(res, data, encoding);
        }
      ).done();
    };

    next();
  };
}

// executes the metrics request.
function _handleMetrics(options, req, res) {
  var
    count = 0,
    data = {
      tokens: []
    };

  if (options.debug) {
    console.log('GET: %s', options.metricsUrl);
  }
/*
  TODO get the metrics from the storage
  for (var token in cache) {
    if (!cache.hasOwnProperty(token)) {
      continue;
    }
    var restSession = cache[token];

    data.tokens.push({
      token: token,
      creation: restSession.creation(),
      modified: restSession.modified(),
      size: restSession.values().length
    });
    count++;
  }
*/
  data.count = count;

  res.send(data);
}

/**
 * Initialize the middleware and if a metricsUrl is defined, then it create the metrics route.
 *
 * @param {object} app the application from express.
 * @param {object} options the configuration object.
 */
module.exports = function (app, options) {

  var
    thisOptions = _prepareOptions(options);

  app.use(_initialize(thisOptions));

  if (utils.isString(thisOptions.metricsUrl)) {
    // register the metrics handler

    var
      url = thisOptions.metricsUrl;

    if (thisOptions.debug) {
      console.log('register the metrics url: %s', url);
    }

    app.get(url, function (req, res) {
      _handleMetrics(thisOptions, req, res);
    });
  }
};
