'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var App = require('../../../app');
var ContactListLayout = require('../views/contactListLayout');
var ContactListActionBar = require('../views/contactListActionBar');
var ContactListView = require('../views/contactListView');

/**
 * Responsible for creating all the necessary views with the model or collection that is passed,
   rendering the views in a region of the DOM and listening for events in the views
 */
class ContactList {
    constructor(options) {
        // Region where the sub-application will be placed
        this.region = options.region;   //<div id="main"class=" container"></div>

        // Allow subapplication to listen and trigger events,
        // useful for subapplication wide events
        _.extend(this, Backbone.Events);
    }

    showList(contacts) {
        // Create the views
        this.layout = new ContactListLayout();  
        this.actionBar = new ContactListActionBar();
        this.contactList = new ContactListView({ collection: contacts });
               
        // Show the views
        /*<div id="main" class=" container">
            <div class="row page-container>
                <div class="actionBar-container"></div>
                <div class="list-container"></div>
                <div class="footer text-muted"></div>
            </div>
        </div >*/
        this.region.show(this.layout);  
        this.layout.getRegion('actions').show(this.actionBar);
        this.layout.getRegion('list').show(this.contactList);

        this.listenTo(this.contactList, 'item:contact:delete', this._deleteContact);        
    }

    //The event handle 
    _deleteContact(view, contact) {
        App.askConfirmation('The contact will be deleted', (isConfirm) => {
            if (isConfirm) {
                contact.destroy({
                    success() {
                        App.notifySuccess('Contact was deleted');
                    },
                    error() {
                        App.notifyError('Ooops... Something went wrong');
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

module.exports = ContactList;