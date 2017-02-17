'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var App = require('../../../app');
var ContactViewLayout = require('../views/contactViewerLayout');
var ContactWidget = require('../views/contactViewerWidget');
var ContactAbout = require('../views/contactViewerAbout');
var ContactCallLog = require('../views/contactViewerCallLog');

/**
 * Show a read-only version of a contact
 */
class ContactViewer {
    constructor(options) {
        // Region where the application will be placed
        this.region = options.region;

        // Allow subapplication to listen and trigger events,
        // useful for subapplication wide events
        _.extend(this, Backbone.Events);
    }

    showContact(contact) {
        // Create the views
        this.layout = new ContactViewLayout();
        this.contactWidget = new ContactWidget({ model: contact });
        this.contactAbout = new ContactAbout({ model: contact });
        this.contactCalls = new ContactCallLog({ model: contact });

        // Show the views
        this.region.show(this.layout);
        this.layout.getRegion('widget').show(this.contactWidget);
        this.layout.getRegion('about').show(this.contactAbout);
        this.layout.getRegion('calls').show(this.contactCalls);

        this.listenTo(this.contactAbout, 'contact:delete', this._deleteContact);
    }

    _deleteContact(contact) {
        App.askConfirmation('The contact will be deleted', isConfirm => {
            if (isConfirm) {
                contact.destroy({
                    success() {                        
                        App.notifySuccess('Contact was deleted');
                        // Redirect user to the contacts list after deletion
                        App.router.navigate('/contacts', true);
                    },
                    error() {
                        // Show error message when something is wrong
                        App.notifyError('Something goes wrong');
                    }
                });
            }
        });
    }

    // Close any active view and remove event listeners
    // to prevent zombie functions
    destroy() {
        this.region.remove();
        this.stopListening();
    }
}

module.exports = ContactViewer;