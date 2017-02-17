'use strict';

var App = require('../../../app');
var Backbone = require('backbone');
var Email = require('../models/email');

App.Collections = App.Collections || {};

class EmailCollection extends Backbone.Collection {
    constructor(options) {
        super(options);
    }

    get model() {
        return Email;
    }
}

App.Collections.ContactEmailCollection = EmailCollection;
module.exports = EmailCollection;