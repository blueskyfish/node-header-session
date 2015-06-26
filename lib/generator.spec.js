
'use strict';

var
  expect = require('chai').expect;

var
  generator = require('./generator');

describe('Test "generator" library', function () {

  it('should generate a token and validate return "true" from this token', function () {
    var
      token = generator.generate();

    expect(token).to.be.a('string');

    expect(generator.validate(token)).to.be.equal(true);
    expect(generator.validate(token)).to.be.equal(true);

  });

  it('should validate tokens, that are valid', function () {

    var
      token = generator.generate() + 'a23';

    expect(generator.validate('abc')).to.be.equal(false);
    expect(generator.validate(token)).to.be.equal(false);
    expect(generator.validate(token.replace('-', ''))).to.be.equal(false);

  });

});
