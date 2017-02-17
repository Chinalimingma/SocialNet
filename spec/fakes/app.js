// spec/fakes/app.js
//A fake object is a simple object that has the same functions as an original one
'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var fakeRouter = {
    //jasmine.createSpy() will return a brand new function
    navigate: jasmine.createSpy()
};
//Simulation of the necessary methods
var FakeApp = {
    router: fakeRouter,
    notifySuccess(message) {
        this.lastSuccessMessage = message;
    },
    notifyError(message) {
        this.lastErrorMessage = message;
    },
    reset() {
        delete this.lastSuccessMessage;
        delete this.lastErrorMessage;
        this.router.navigate = jasmine.createSpy();
    }
};
_.extend(FakeApp, Backbone.Events);
module.exports = FakeApp;
