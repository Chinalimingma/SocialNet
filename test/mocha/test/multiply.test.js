var multiply = require('../../../mocha-demos/demo/src/multiply');
var expect = require('chai').expect;

describe('Multiplication function test', function() {
    it('1 by 1 should be equal to 1', function() {
    expect(multiply(1, 1)).to.be.equal(1);
  });
})
