
'use strict';

var
  expect = require('chai').expect;

var
  session = require('./session');

describe('Test "Session" class', function () {

  it ('should create a session with eqauls creation and modified date', function () {

    var
      sess = session.createSession('abcdef');

    expect(sess).not.to.be.null;
    expect(sess.creation()).to.equal(sess.modified());

  });

  it ('should have a session values', function () {

    var
      sess = session.createSession('abcdef');

    expect(sess).not.to.be.null
    expect(sess.values()).not.to.be.null;

  })
});