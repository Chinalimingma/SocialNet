var expect = require('chai').expect;

describe('hooks', function () {
	
  var foo = false;

  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
	foo = true;
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

	// test cases
  it('修改全局变量应该成功', function () {
  	expect(foo).to.be.equal(true);
  });
	

});