var expect = require('chai').expect;
var capitalize = require('../../../mocha-demos/demo/src/capitalize.js');

describe('capitalize', function () {
    it('capitalizes the first letter of single words', function () {
        expect(capitalize('express')).to.be.equal('Express');
        expect(capitalize('cats')).to.be.equal('Cats');
    });

    it('makes the rest of the string lowercase', function () {
        expect(capitalize('heLLo')).to.be.equal('Hello');
        expect(capitalize('JavaScript')).to.be.equal('Javascript');
    });

    it('leaves empty string alone', function () {
        expect(capitalize('')).to.be.equal('');
    });

    it("leaves strings with no words alone", function () {
        expect(capitalize(" ")).to.equal(" ");
        expect(capitalize("123")).to.equal("123");
    });

    it("capitalizes multiple-word strings", function () {
        expect(capitalize("what is Express?")).to.equal("What is express?");
        expect(capitalize("i love lamp")).to.equal("I love lamp");
    });

    it("leaves already-capitalized words alone", function () {
        expect(capitalize("Express")).to.equal("Express");
        expect(capitalize("Evan")).to.equal("Evan");
        expect(capitalize("Catman")).to.equal("Catman");
    });

    it("capitalizes String objects without changing their values", function () {
        var str = new String("who is JavaScript?");
        expect(capitalize(str)).to.equal("Who is javascript?");
        // str.valueOf()将String对象转换为正常的字符串
        expect(str.valueOf()).to.equal("who is JavaScript?");
    });
});

describe('User', function () {
   /*
   class User {
        constructor(options) {
            this.firstName = options.firstName;
            this.lastName = options.lastName;
            this.birthday = options.birthday;
        }

        getName() {
            return this.firstName + " " + this.lastName;
        }

        getAge() {
            return new Date() - this.birthday;
        }
    }
    */
    var User = function (options) {
        this.firstName = options.firstName;
        this.lastName = options.lastName;
        this.birthday = options.birthday;
        this.getName = function () {
            return this.firstName + " " + this.lastName;
        };
        this.getAge = function () {
            return new Date() - this.birthday;
        };
    };

    var user;
    beforeEach(function () {
        user = new User({
            firstName: "Douglas",
            lastName: "Reynholm",
            birthday: new Date(1954,2,13)
        });        
    });

    it("can extract its name", function () {
        expect(user.getName()).to.equal("Douglas Reynholm");
    });

    it("can get its age in milliseconds", function () {
        var now = new Date();
        expect(user.getAge()).to.equal(now - user.birthday);
    });
});