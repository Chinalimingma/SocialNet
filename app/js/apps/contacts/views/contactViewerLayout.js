'use strict';

var Layout = require('../../../common').Layout;
var template = require('../templates/contactViewLayout.tpl');

class ContactViewLayout extends Layout {
    constructor(options) {
        super(options);
        this.template = template;
        //Define three show container by CSS id
        this.regions = {
            widget: '#contact-widget',      //show avatar
            about: '#about-container',      //show about
            calls: '#call-log-container'    //show log
        };
    }

    //All layout containers are defined as 'row page-container' class
    //Defines a container that contains three regions container
    get className() {
        return 'row page-container';
    }
}

module.exports = ContactViewLayout;