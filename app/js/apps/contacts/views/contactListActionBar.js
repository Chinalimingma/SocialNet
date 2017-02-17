'use strict';

var App = require('../../../app');
var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactListActionBar.tpl');

class ContactListActionBar extends ModelView {
    constructor(options) {
        super(options);
        this.template = template;
    }
    //Container class in Region container
    get className() {
        return 'options-bar col-xs-12';
    }

    get events() {
        return {
            'click button': 'createContact'
        };
    }

    //redirect the user to the contact form to create a new user. 
    createContact() {
        App.router.navigate('contacts/new', true);
    }
}

module.exports = ContactListActionBar;