/*
上面的测试用例，需要4000毫秒之后，才有运行结果。所以，需要用-t或--timeout参数，
改变默认的超时设置。
上面的测试用例里面，有一个done函数。it块执行的时候，传入一个done参数，当测试结束的时候，
必须显式调用这个函数，告诉Mocha测试结束了。否则，Mocha就无法知道，测试是否结束，
会一直等到超时报错。
$ mocha -t 5000 timeout.test.js
*/

var expect = require('chai').expect;

describe('timeout.test.js - Timeout test', function () {
    it('The test should end in 5000 ms', function (done) {
        var x = true;
        var f = function () {
            x = false;
            expect(x).to.be.not.ok;
            done();
        };
        setTimeout(f, 4000);
    });
});