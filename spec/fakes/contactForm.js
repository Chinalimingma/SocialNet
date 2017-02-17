// spec/fakes/contactFormLayout.js

'use strict';
var Layout = require('../../app/js/common').Layout;
class FakeFormLayout extends Layout {
    constructor(options) {
        super(options);
        this.template = '<div class="phone-list-container" />'
            + '<div class="email-list-container" />';
        this.regions = {
            phones: '.phone-list-container',
            emails: '.email-list-container'
        };
    }
}
module.exports = FakeFormLayout;
