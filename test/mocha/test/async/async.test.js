var request = require('superagent');
var expect = require('chai').expect;

describe('Async.test.js - Asynchronous test', function () {
    it('An asynchronous request should return an object', function (done) {
        request
            .get('https://api.github.com')
            .end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
    });
});