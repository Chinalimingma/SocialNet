'use strict';

var Layout = require('../../../common').Layout;
var template = require('../templates/contactEditorFormLayout.tpl');

class ContactFormLayout extends Layout {
    constructor(options) {
        super(options);
        this.template = template;
        this.regions = {
            preview: '#preview-container',
            form: '#form-container'
        };
    }

    //All layout containers are defined as 'row page-container' class
    //The className of the View's root element.
    get className() {
        //Rows must be placed within a .container (fixed-width) or .container-fluid (full-width) 
        //for proper alignment and padding. Use rows to create horizontal groups of columns.
        return 'row page-container'; //<div class="row page-container">......</div> 
    }
}

module.exports = ContactFormLayout;