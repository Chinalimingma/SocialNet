/**
Controller's responsibility, as follows:
• It creates all the necessary views with the model or collection that is passed
• It renders the views in a region of the DOM
• It listens for events in the views

The ContactEditor controller's responsibility is to render the necessary views in
order to allow the user to update or create new contacts.
**/

// spec/apps/contacts/controller/contactEditor.js
var _ = require('underscore');
var Backbone = require('backbone');

//proxyquery -Dependency injection, overwrites the original require() function
var proxyquery = require('proxyquireify')(require); 

var FakeApp = require('../../../fakes/app');
var FakeRegion = require('../../../fakes/region');
var FakeContactForm = require('../../../fakes/contactForm');

/**
    Faking almost all the views of the ContactEditor controller, don't need the real views
    as we are not testing the output HTML, that's a job for view testing
**/
var fakes = {
    '../../../app': FakeApp,    
    '../views/contactEditorPreview': Backbone.View,
    '../views/contactEditorPhoneListView': Backbone.View,
    '../views/contactEditorEmailListView': Backbone.View,
    '../views/contactEditorForm': FakeContactForm,
    '../collections/phoneCollection': Backbone.Collection,
    '../collections/emailCollection': Backbone.Collection
};

//Use a second argument to overwrite the original dependencies,
//isolate the ContactEditor controller and instead of using the real objects,
var ContactEditor =
    proxyquery('../../../../app/js/apps/contacts/controllers/contactEditor', fakes);

//The first test is to check whether the subapplication is rendered in the right region
describe('ContactApp Controller contactEditor', () => {
    var fakeContact;
    var contactEditor;
    var region;

    beforeEach(() => {
        region = new FakeRegion();
        contactEditor = new ContactEditor({ region });
        fakeContact = new Backbone.Model({
            name: 'John Doe',
            facebook: 'https://www.facebook.com/john.doe',
            twitter: '@john.doe',
            github: 'https://github.com/johndoe',
            google: 'https://plus.google.com/johndoe'
        });
    });

    describe('showEditor method test', () => {
        it('renders the editor view in the given region', () => {
            //spyOn(object, methodName) where object.method() is a function
            spyOn(region, 'show').and.callThrough();

            //Creates all the necessary views with the model
            contactEditor.showEditor(fakeContact);
            //Assert
            //rendered in the right region
            expect(region.show).toHaveBeenCalled();
        });

        it('binds the avatar:selected event in the contactPreview', () => {
            var expectedBlob = new Blob(['just text'], {
                type: 'text/plain'
            });

            //Creates all the necessary views with the model
            contactEditor.showEditor(fakeContact);

            // Fake the uploadAvatar method to prevent side effects
            //jasmine.createSpy() will return a brand new function
            contactEditor.uploadAvatar = jasmine.createSpy();
            
            contactEditor.contactPreview.trigger('avatar:selected', expectedBlob);
            expect(contactEditor.avatarSelected).toEqual(expectedBlob);
        });

        it('binds the form:save event in the contactForm', () => {
            ///Arrange
            var contactObject = {};
            // Fake the uploadAvatar method to prevent side effects
            contactEditor.saveContact = jasmine.createSpy();
            
            //Action
            contactEditor.showEditor(fakeContact);           
            contactEditor.contactForm.trigger('form:save', contactObject);
            //Assert
            expect(contactEditor.saveContact).toHaveBeenCalled;
            expect(contactEditor.saveContact).toHaveBeenCalledWith(contactObject);
        });

    });

    describe('saveContact method test', () => {
        /**
        In this test case, the controller will call the save() method in the model to
        save the contact and Backbone will make an Ajax call to the server.
        **/

        ///Arrange
        beforeEach(() => {
            //overwrites the original XMLHttpRequest object and initialize the Ajax 
            //plugin to fake the Ajax calls
            jasmine.Ajax.install();
            //Fake the contact url
            fakeContact.url = '/fake/contact';
            //Fake upload avatar, we are not testing this feature
            contactEditor.uploadAvatar = function (contact, options) {
                options.success();
            };
            contactEditor.showEditor(fakeContact);                       
        });
        afterEach(() => {
            //restore the original XMLHttpRequest object
            jasmine.Ajax.uninstall();
            FakeApp.reset();
        });

        var successOptions = {
            status: '200',
            contentType: 'application/json',
            responseText: '{}'
        };

        var errorOptions = {
            status: '400',
            contentType: 'application/json',
            responseText: '{}'
        };

        describe('different response from the server', () => {

            it('successful response', () => {
                 
                //Action
                //Make an Ajax call to the server
                contactEditor.saveContact(fakeContact);
                //Simulate a successful request
                jasmine.Ajax.requests.mostRecent().respondWith(successOptions);
                //Assert
                expect(FakeApp.lastSuccessMessage).toEqual('Contact saved');
                expect(FakeApp.router.navigate)
                    .toHaveBeenCalledWith('contacts', true);
            });

            it('failed response', () => {
                //Action
                contactEditor.saveContact(fakeContact);
                //Simulate a failed request
                jasmine.Ajax.requests.mostRecent().respondWith(errorOptions);
                //Assert
                expect(FakeApp.lastErrorMessage).toEqual('Something goes wrong');
                expect(FakeApp.router.navigate).not.toHaveBeenCalled();
            });
        });

        describe('Requested to the server correctly', () => {
            it('saves the model with the phones and emails added', () => {

                //Arrange
                var expectedPhone = {
                    description: 'test',
                    phone: '555 5555'
                };
                var expectedEmail = {
                    description: 'test',
                    phone: 'john.doe@example.com'
                };
                contactEditor.phones = new Backbone.Collection([expectedPhone]);
                contactEditor.emails = new Backbone.Collection([expectedEmail]);

                /*
                var params = new FormData();
                params.append('phones', contactEditor.phones);
                params.append('emails', contactEditor.emails);

                //Post
                var xhr = new XMLHttpRequest();
                xhr.open('POST', fakeContact.url, true);
                xhr.send(params);

                //Get
                var xhr = new XMLHttpRequest();
                xhr.open('GET', fakeContact.url);
                xhr.send();
                */                
                
                //Action
                contactEditor.saveContact(fakeContact);

                var requestText = jasmine.Ajax.requests.mostRecent().params;
                var request = JSON.parse(requestText);

                //Assert
                expect(jasmine.Ajax.requests.mostRecent().url).toBe(fakeContact.url);
                expect(request.phones.length).toEqual(1);
                expect(request.emails.length).toEqual(1);
                expect(requestText.phones).tobeTruthly;
                expect(request.emails).toContain(expectedEmail);
                                
            });
        });

        describe('contact is not valid or new', () => {
            it('does not save the contact if the model is not valid', () => {
                // Emulates an invalid model
                fakeContact.isValid = function () {
                    return false;
                };
                contactEditor.saveContact(fakeContact);
                //If the contact is not valid, then the controller will not send anything
                //to the server. Ajax has never been requested
                expect(jasmine.Ajax.requests.count()).toEqual(0);
            });

            it('uploads the selected avatar if model is new', () => {
                // Emulates a new model
                fakeContact.isNew = function () {
                    return true;
                };
                contactEditor.uploadAvatar = jasmine.createSpy('uploadAvatar');

                contactEditor.saveContact(fakeContact);
                jasmine.Ajax.requests.mostRecent().respondWith(successOptions);
                //The avatar image only is uploaded immediately
                expect(contactEditor.uploadAvatar).toHaveBeenCalled();
            });
            it('does not upload the selected avatar if model is not new', () => {
                // Emulates a not new model
                fakeContact.isNew = function () {
                    return false;
                };
                contactEditor.uploadAvatar = jasmine.createSpy('uploadAvatar');
                contactEditor.saveContact(fakeContact);
                jasmine.Ajax.requests.mostRecent().respondWith(successOptions);
                expect(contactEditor.uploadAvatar).not.toHaveBeenCalled();
            });
        });
    });
});
