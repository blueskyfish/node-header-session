
'use strict';

var
  chai = require('chai');

var
  session = require('./session');

describe('Test "Session" class', function () {

  it ('should create a session with eqauls creation and modified date', function () {

    var
      sess = session.createSession('abcdef');

    chai.expect(sess).is.not.equal(null);
    chai.expect(sess.creation()).to.equal(sess.modified());

  });

  it ('should have a session values', function () {

    var
      sess = session.createSession('abcdef');

    chai.expect(sess).is.not.equal(null);
    chai.expect(sess.values()).is.not.equal(null);

  })
});