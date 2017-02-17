/*
Mocha内置对Promise的支持，允许直接返回Promise，等到它的状态改变，再执行断言，
而不用显式调用done方法。
*/
var fetch = require('node-fetch');
var expect = require('chai').expect;

describe('promise.test.js - Asynchronous test', function () {
  it('An asynchronous request should return an object', function() {
    return fetch('https://api.github.com')
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        expect(json).to.be.an('object');
      });
  });
});