'use strict';
var App = require('../../../app');
var Backbone = require('backbone');
var Phone = require('../models/phone');
App.Collections = App.Collections || {};

class PhoneCollection extends Backbone.Collection {
    constructor(options) {
        super(options);
    }

    get model() {
        return Phone;
    }
}

App.Collections.ContactPhoneCollection = PhoneCollection;
module.exports = PhoneCollection;