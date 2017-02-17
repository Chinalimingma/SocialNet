/**
Views manage the relationship between data (such as, models or collections) and the
user interactions (DOM). In the case of views, you should test for the following:
• Rendering: Given a model or collection, you should verify that the output
  HTML is the right one
• Events: This verifies that the DOM events are handled correctly
• Model changes: If the model changes something, the view should be in sync
**/

//the responsibility of contactForm view is to show a form to the user and then get the
//user input to update a model.
var Backbone = require('backbone');
var ContactForm = require('../../../../app/js/apps/contacts/views/contactEditorForm');
describe('ContactApp contactEditorForm view ', () => {
    //isolate the ContactView object
    var fakeContact;

    //When you define one or more beforeEach() functions in describe(), then all the 
    //beforeEach() functions will always be executed before the it() functions.
    beforeEach(() => {
        fakeContact = new Backbone.Model({
            name: 'John Doe',
            facebook: 'https://www.facebook.com/john.doe',
            twitter: '@john.doe',
            github: 'https://github.com/johndoe',
            google: 'https://plus.google.com/johndoe'
        });
    });

    describe('ContactEditorForm container element show a given model', () => {
        it('has the rigth class of container element', () => {
                var view = new ContactForm({ model: fakeContact });
                expect(view.className).toEqual('form-horizontal');
        });

        it('renders the rigth HTML', () => {
            var view = new ContactForm({ model: fakeContact });
            view.render();
            expect(view.$el.html()).toContain(fakeContact.get('name'));
            expect(view.$el.html()).toContain(fakeContact.get('twitter'));
            expect(view.$el.html()).toContain(fakeContact.get('github'));
            expect(view.$el.html()).toContain(fakeContact.get('google'));
            expect(view.$el.html()).toContain(fakeContact.get('facebook'));        
        });
    });
    
    describe('Verifies contactForm DOM event', () => {
        it('triggers a (form:save) event when save button is cliecked', () => {

            var view = new ContactForm({ model: fakeContact });

            //creates a spy function that will be used as the event handler 
            //for the from:save event.
            var callback = jasmine.createSpy('callback');

            view.on('form:save', callback);
            view.render();

            // Emulate a user click
            view.$el.find('#save').trigger('click');
            //Emulates a click event on the save button and tests whether the callback 
            //function was called.
            expect(callback).toHaveBeenCalled();

            //The save event generates a post action, and the Model acts as the data 
            //object submitted
            expect(callback).toHaveBeenCalledWith(fakeContact);            
        });

        //Changing the values in the input fields and then clicking the save button in the form.
        it('updates the model when the save button is clicked', () => {

            var view = new ContactForm({ model: fakeContact });
            var callback = jasmine.createSpy('callback');
            var expectedValues = {
                name: 'Jane Doe',
                facebook: 'https://www.facebook.com/example',
                twitter: '@example',
                github: 'https://github.com/example',
                google: 'https://plus.google.com/example'
            };

            view.on('form:save', callback);
            view.render();

            // Change the input fields
            view.$el.find('#name').val(expectedValues.name);
            view.$el.find('#facebook').val(expectedValues.facebook);
            view.$el.find('#twitter').val(expectedValues.twitter);
            view.$el.find('#github').val(expectedValues.github);
            view.$el.find('#google').val(expectedValues.google);

            // Emulate a change events on all input fields
            view.$el.find('input').trigger('change');

            // Emulate a user click
            view.$el.find('#save').trigger('click');

            // Get the argument passed to the callback function
            var callArgs = callback.calls.argsFor(0);
            var model = callArgs[0];

            expect(model.get('name')).toEqual(expectedValues.name);
            expect(model.get('facebook')).toEqual(expectedValues.facebook);
            expect(model.get('twitter')).toEqual(expectedValues.twitter);
            expect(model.get('github')).toEqual(expectedValues.github);
            expect(model.get('google')).toEqual(expectedValues.google);
        });
    });   
});

