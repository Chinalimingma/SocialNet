'use strict';

var App = require('../../app');
var ContactList = require('./controllers/contactList');
var ContactViewer = require('./controllers/contactViewer');
var ContactEditor = require('./controllers/contactEditor');
var Contact = require('./models/contact');
var ContactCollection = require('./collections/contactCollection');


/**
 *  This is the application façade that is called from the router
    The responsibility of the façade is to fetch the necessary data from the
    RESTful API and pass the data to a controller.    
 */
class ContactsApp {
    constructor(options) {
        this.region = options.region;   //<div id="main"class=" container"></div>
    }

    showContactList() {
        App.trigger('loading:start');
        App.trigger('app:contacts:started');
       
        //The fetch method returns a jQuery promise
        new ContactCollection().fetch({
            
            success: (collection) => {
                // Show the contact list subapplication if the list can be fetched
                this.showList(collection);
                App.trigger('loading:stop');
            },

            fail: (collection, response) => {
                // Show error message if something goes wrong
                App.trigger('loading:stop');
                App.trigger('server:error', response);
            }           
        });
    }

    showNewContactForm() {
        App.trigger('app:contacts:new:started');
        this.showEditor(new Contact());
    }

    showContactEditorById(contactId) {
        App.trigger('loading:start');
        App.trigger('app:contacts:started');
        
        new Contact({ id: contactId }).fetch({
            success: (model) => {
                this.showEditor(model);
                App.trigger('loading:stop');
            },
            fail: (collection, response) => {
                App.trigger('loading:stop');
                App.trigger('server:error', response);
            }
        });
    }

    showContactById(contactId) {
        App.trigger('loading:start');
        App.trigger('app:contacts:started');

        new Contact({ id: contactId }).fetch({
            success: (model) => {
                this.showViewer(model);
                App.trigger('loading:stop');
            },
            fail: (collection, response) => {
                App.trigger('loading:stop');
                App.trigger('server:error', response);
            }
        });
    }
    /** p36
    new Contact({id: contactId}).fetch()
        .done(function(model) {
            //alert('the fetch completed successfully')
            this.showViewer(model);
            App.trigger('loading:stop');
        })
        .fail(function(collection, response) {
            //alert('an error occurred during the fetch')
            App.trigger('loading:stop');
            App.trigger('server:error', response);
        });    
    **/

    //Each route corresponds to a controller
    showList(contacts) {
        var contactList = this.startController(ContactList);
        contactList.showList(contacts);
    }

    showEditor(contact) {
        var contactEditor = this.startController(ContactEditor);
        contactEditor.showEditor(contact);
    }

    showViewer(contact) {
        var contactViewer = this.startController(ContactViewer);
        contactViewer.showContact(contact);
    }

    //Start controller singleton instantiate
    startController(Controller) {
        if (this.currentController &&
            this.currentController instanceof Controller) {
            return this.currentController;
        }

        if (this.currentController && this.currentController.destroy) {
            this.currentController.destroy();
        }

        //Run Controller
        this.currentController = new Controller({ region: this.region });
        return this.currentController;
    }
    /* Close any active controller and remove event listeners to prevent zombie functions
    //destroy() {
        //this.region.remove();
        //this.stopListening();
    }*/
}

module.exports = ContactsApp;