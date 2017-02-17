'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var App = require('../../../app');
var ContactFormLayout = require('../views/contactEditorFormLayout');
var ContactPreview = require('../views/contactEditorPreview');
var PhoneListView = require('../views/contactEditorPhoneListView');
var EmailListView = require('../views/contactEditorEmailListView');
var ContactForm = require('../views/contactEditorForm');
var PhoneCollection = require('../collections/phoneCollection');
var EmailCollection = require('../collections/emailCollection');

class ContactEditor {
    constructor(options) {
        this.region = options.region;

        // Allow subapplication to listen and trigger events,
        // useful for subapplication wide events
        _.extend(this, Backbone.Events);
    }

    showEditor(contact) {
        // Data
        var phonesData = contact.get('phones') || [];
        var emailsData = contact.get('emails') || [];

        //To make the controller testable, it is a common practice to put the views as
        //attributes of the controller
        this.phones = new PhoneCollection(phonesData);
        this.emails = new EmailCollection(emailsData);

        // Create the views
        this.layout = new ContactFormLayout({ model: contact });
        this.phonesView = new PhoneListView({ collection: this.phones });
        this.emailsView = new EmailListView({ collection: this.emails });
        this.contactForm = new ContactForm({ model: contact });

        this.contactPreview = new ContactPreview({
            controller: this,
            model: contact
        });

        // Render the views
        this.region.show(this.layout);
        this.layout.getRegion('form').show(this.contactForm);
        this.layout.getRegion('preview').show(this.contactPreview);
        this.contactForm.getRegion('phones').show(this.phonesView);
        this.contactForm.getRegion('emails').show(this.emailsView);

        //Memory-related performance issues about listenTo p103
        this.listenTo(this.contactForm, 'form:save', this.saveContact);
        this.listenTo(this.contactForm, 'form:cancel', this.cancel);
        this.listenTo(this.contactForm, 'phone:add', this.addPhone);
        this.listenTo(this.contactForm, 'email:add', this.addEmail);

        this.listenTo(this.phonesView, 'item:phone:deleted', (view, phone) => {
            this.deletePhone(phone);
        });
        this.listenTo(this.emailsView, 'item:email:deleted', (view, email) => {
            this.deleteEmail(email);
        });

        this.listenTo(this.contactPreview, 'avatar:selected', blob => {
            this.avatarSelected = blob;

            if (!contact.isNew()) {//contact already exists on the server                
                this.uploadAvatar(contact);
            }
        });
    }

    saveContact(contact) {
        var phonesData = this.phones.toJSON();
        var emailsData = this.emails.toJSON();

        contact.set({
            phones: phonesData,
            emails: emailsData
        });

        if (!contact.isValid(true)) {
            return;
        }

        var wasNew = contact.isNew();

        if (contact.has('avatar')) {            
            contact.unset('avatar');//contact.attributes.avatar ==undefined
        }

        function notifyAndRedirect() {
            // Redirect user to contact list after save
            App.notifySuccess('Contact saved');
            App.router.navigate('contacts', true);
        }

       
        //save() is mapped as a create or update operation; it depends on the
        //isNew() method. After save, isNew returns false
        contact.save(null, {
            success: () => {
                // If we are not creating an user it's done
                if (!wasNew) {
                    notifyAndRedirect();
                    return;
                }

                // Resource valid endpoint exists to upload the subresourc avatar 
                this.uploadAvatar(contact, {
                    success: notifyAndRedirect
                });
            },
            error: ()=> {
                // Show error message if something goes wrong
                App.notifyError('Something goes wrong');
            }
        });
        /**
        Here's an example of save used with a promise-based callback:
        var contact = new Contact({id:contactId});
        contact.save().done(function(response) {
            alert(response); // alerts the the response's JSON
        });
        **/
    }

    addPhone() {
        this.phones.add({});
    }

    addEmail() {
        this.emails.add({});
    }

    deletePhone(phone) {
        this.phones.remove(phone);
    }

    deleteEmail(email) {
        this.emails.remove(email);
    }

    uploadAvatar(contact, options) {
        // Tell to others that upload will start
        this.trigger('avatar:uploading:start');
        //post api/contacts/contactId/avatar
        contact.uploadAvatar(this.avatarSelected, {
            progress: (length, uploaded, percent) => {
                // Tell to others that upload is in progress
                this.trigger('avatar:uploading:progress',
                    length, uploaded, percent);
                if (options && _.isFunction(options.success)) {
                    options.success();
                }
            },
            success: () => {
                // Tell to others that upload was done successfully
                this.trigger('avatar:uploading:done');
            },
            error: err => {
                // Tell to others that upload was error
                this.trigger('avatar:uploading:error', err);
            }
        });
    }

    cancel() {
        // Warn user before make redirection to prevent accidental
        // cencel
        App.askConfirmation('Changes will be lost', isConfirm => {
            if (isConfirm) {
                App.router.navigate('contacts', true);
            }
        });
    }

    // Close any active view and remove event listeners to prevent zombie functions
    destroy() {
        this.region.remove();
        this.stopListening();
    }
}

module.exports = ContactEditor;
