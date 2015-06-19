/*!
 * Project: node-rest-header-session
 * Filter the request header and if the middleware finds the token,
 * then it append the "restSession" object to the request instance.
 */

// require external modules
var
  extend = require('extend');

var
  utils = require('./lib/utils');

// constants
var
  HEADER_NAME = 'x-rest-session-token',
  METRICS_URL = '/metrics/rest-header';

// default options
var
  defaultOptions = {
    name: HEADER_NAME,
    debug: true,
    metricsUrl: METRICS_URL
  };

// Cache for the rest header
var
  cache = {};


// extends and prepares the options...
function _prepareOptions (options) {
  var
    tempOptions = extend(false, {}, defaultOptions);

  if (options) {
    tempOptions = extend(false, tempOptions, options);
  }
  
  if (!utils.isFunction(tempOptions.genToken)) {
    if (tempOptions.debug) {
      console.log('missing the genToken() function in the options');
    }
    
    tempOptions.genToken = function () {
      return utils.generator();
    };
  }

  return tempOptions;
}


// initialize the middleware
function _initialize(options) {

  // adjust the configuration
  var
    headerName = options.name || HEADER_NAME;

  // handle the request
  return function handleRequest(req, res, next) {

    var token, restSession;

    if (req.restSession) {
      if (options.debug) {
        console.log('rest session is already created');
      }
      next();
      return;
    }

    token = req.get(headerName);

    if (!token) {
      // create a new token
      token = options.genToken();
      
      if (options.debug) {
        console.log('create new token %s', token);
      }
    }
    // update the session token
    res.set(headerName, token);

    // get the session
    restSession = cache[token];

    if (!restSession) {
      // session is not available
      restSession = cache[token] = {};
      if (options.debug) {
        console.log('create a restSession to %s', token);
      }
    }

    // update the request object
    req.restSession = restSession;

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
    console.log('GET: %s (metrics from rest session)', options.metricsUrl);
  }

  for (var token in cache) {
    if (!cache.hasOwnProperty(token)) {
      continue;
    }
    data.tokens.push(token);
    count++;
  }

  data.count = count;

  res.send(data);
}

/**
 * TBD
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
      console.log('register the GET: %s', url);
    }

    app.get(url, function (req, res) {
      _handleMetrics(thisOptions, req, res);
    });
  }
};
