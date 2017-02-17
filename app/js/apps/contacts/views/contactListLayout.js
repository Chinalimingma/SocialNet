'use strict';

var Layout = require('../../../common').Layout;
var template = require('../templates/contactListLayout.tpl');

class ContactListLayout extends Layout {
    constructor(options) {
        super(options);
        this.template = template;

        //Define two Region containers for actions-bar and list by CSS class
        this.regions = {
            actions: '.actionBar-container',
            list: '.list-container'
        };
    }

    //All layout containers are defined as 'row page-container' class
    //The topmost container for the contactList subapplication in mainRegion
    get className() {
        return 'row page-container';
    }
}

module.exports = ContactListLayout;