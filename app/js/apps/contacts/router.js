'use strict';

var Backbone = require('backbone');

/**
 * The entry point of contacts subapplication,
   which ideally share the same namespace --contacts
 */
class ContactsRouter extends Backbone.Router {
    constructor(options) {
        super(options);
        
        this.routes = {
            //Contacts: This lists all available contacts
            'contacts': 'showContactList',
            'contacts/page/:page': 'showContactList',
            //contacts/new: This shows a form to create a new contact
            'contacts/new': 'createContact',
            //contacts/view/:id: This shows an invoice given its ID
            'contacts/view/:id': 'showContact',
            //contacts/edit/:id: This shows a form to edit a contact
            'contacts/edit/:id': 'editContact'
        };
        //Instantiates a new Backbone.history and bind all defined routes to Backbone.history
        this._bindRoutes();
    }

    //**Triggered route handler parses the URL and delegates the request to the subapp

    showContactList(page) {
        // Page should be a postive number grater than 0
        page = page || 1;
        page = page > 0 ? page : 1;

        //Start the subapplication singleton
        var app = this.startApp();
        app.showContactList(page);
    }

    createContact() {
        var app = this.startApp();
        app.showNewContactForm();
    }

    showContact(contactId) {
        var app = this.startApp();
        app.showContactById(contactId);
    }

    editContact(contactId) {
        var app = this.startApp();
        app.showContactEditorById(contactId);
    }

    //Subapplication singleton
    startApp() {
        var App = require('../../app');
        var ContactsApp = require('./app');
        return App.startSubApplication(ContactsApp); //singleton
    }
}
//Register routers in the App.Routers global object in order to be initialized.

module.exports = new ContactsRouter;

