//http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html
var add = require('../../../mocha-demos/demo/src/add.js');
//指定使用它的expect断言风格
var expect = require('chai').expect;

describe('Test of add function', function () {//测试套件

    it('1 adds 1 to be equal 2', function () {//测试用例
        expect(add(1, 1)).to.be.equal(2);
    });

    it('Any number plus 0 should be equal to itself', function () {
        expect(add(1, 0)).to.be.equal(1);
    });

    it('2 adds 7 to be equal 9', function () {
        expect(add(2, 7)).to.be.equal(9);
    });
});
