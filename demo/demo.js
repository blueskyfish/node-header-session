/**
 * Demo App for middleware "node-header-session"
 */
 
 'use strict';
 
var
  express = require('express');

var
  headerSession = require('..'),
  fileStorage = require('../lib/file-storage'),
  utils = require('../lib/utils');

var
  app = express();

app.use(express.static('static'));

fileStorage.init({
  storagePath: 'file-storage',
  blacklist: ['readme.md']
}).then(
  function (pathname) {
    console.log('session stores in the directory %s', pathname);
  },
  function (reason) {
    console.log('error in session storage: ', reason);
  }
);

headerSession(app, {
  name: 'x-demo-session-token',
  debug: true,
  storage: fileStorage,
  metricsUrl: '/metrics/header-session'
});

app.get('/count', function (req, res) {
  
  req.headerSession.getSession().then(function (session) {
    console.log('count: receive session: ', session);
    var count = session.count || 0;
    session.count = ++count;
    res.send({
      count: count
    });
  });
});

app.listen(3000, function () {
  console.log('demo server is startet and listen on http://localhost:3000');
});

function gracefulShutdown() {
  if (utils.isFunction(fileStorage.clear)) {
    fileStorage.clear().then(
      function (result) {
        console.log('shutdown demo app: session storage is clean: ', result);
        process.exit();
      },
      function (reason) {
        console.log('shutdown demo app has an error: ', reason);
        process.exit();
      }
    );
  }
  return true;
}

// listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);   

   