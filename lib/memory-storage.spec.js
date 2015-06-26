
'use strict';

var
  expect = require('chai').expect;

var
  memory = require('./memory-storage');

describe('Test "MemoryStorage" class', function () {

  beforeEach(function () {
    memory.clear();
  });

  it('should create a new session and return the session value', function (done) {
    memory.load('abcdef').then(
      function (session) {
        expect(session).not.to.be.undefined;
        done();
      }
    );
  });

  it('should load the session three time and property "count" is present', function (done) {
    var
      token = 'abcdef';

    // load first time and set the property "count".
    memory.load(token).then(
      function (session) {
        session.count = 1;
        store(token, session, function () {});
      }
    );


    process.nextTick(function () {
      memory.load(token).then(
        function (session) {
          expect(session).not.to.be.undefined;
          expect(session).to.have.property('count', 1);
        }
      );
    });
    process.nextTick(function () {
      memory.load(token).then(
        function (session) {
          expect(session).not.to.be.undefined;
          expect(session).to.have.property('count', 1);
          done();
        }
      );
    });

  });


  function store(token, session, done) {
    memory.store(token, session).then(done);
  }
});