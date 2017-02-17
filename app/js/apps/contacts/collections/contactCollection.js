'use strict';

var Backbone = require('backbone');
var Contact = require('../models/contact');

class ContactCollection extends Backbone.Collection {
    constructor(options) {
        super(options);
        this.store ='contacts'//for indexDB           
    }
    //the model property of a Collection is only used when new Models are 
    //created through the Collection.
    get model() {
        return Contact;
    }

    get url() {
        return '/api/contacts';
    }
           
}
module.exports = ContactCollection;
