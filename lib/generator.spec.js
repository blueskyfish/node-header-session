
'use strict';

var
  chai = require('chai');

var
  generator = require('./generator');

describe('Test "generator" library', function () {

  it('should generate a token and validate return "true" from this token', function () {
    var
      token = generator.generate();

    chai.expect(token).to.be.a('string');

    chai.expect(generator.validate(token)).to.be.equal(true);

  });

  it('should validate tokens, that are valid', function () {

    var
      token = generator.generate() + 'a23';

    chai.expect(generator.validate('abc')).to.be.equal(false);
    chai.expect(generator.validate(token)).to.be.equal(false);
    chai.expect(generator.validate(token.replace('-', ''))).to.be.equal(false);

  });

});
