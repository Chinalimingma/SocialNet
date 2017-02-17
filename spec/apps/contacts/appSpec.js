/** p124
The subapplication façade's responsibility is to create the model or collect objects and
create the appropriate subapplication controller to render the fetched data. 
**/

var proxyquery = require('proxyquireify')(require);
var FakeApp = require('../../fakes/app');
var FakeRegion = require('../../fakes/region');
// To show the contact editor, the Façade should fetch the contact by its ID and then 
// run the ContactEditor subapplication
var FakeContactEditor = require('../../fakes/contactEditor');
var fakes = {
    '../../app': FakeApp,
    './controllers/contactEditor': FakeContactEditor,
    './controllers/contactList': {},
    './controllers/contactViewer': {}
    /**
     *Also the following are not simulated, they defines the url
      var Contact = require('./models/contact');
      var ContactCollection = require('./collections/contactCollection');     
     */
};
var ContactsApp = proxyquery('../../../app/js/apps/contacts/app', fakes);

describe('ContactApp application facade', () => {
    var app;
    var region;
    var fakeResponse = {
            name: 'John Doe',
            facebook: 'https://www.facebook.com/john.doe',
            twitter: '@john.doe',
            github: 'https://github.com/johndoe',
            google: 'https://plus.google.com/johndoe'
        };
     var successOptions= {
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeResponse)
        };
     var contactId = 1;

    //Arrange
    beforeEach(() => {
        region = new FakeRegion();
        //create a Façade object
        app = new ContactsApp({ region });        
        //fake the Ajax calls
        jasmine.Ajax.install();
    });
    afterEach(() => {
        jasmine.Ajax.uninstall();
    });
    describe('showContactEditorById method test: contactId=1', () => {     
        it('fetches correct data from the server', () => {
            //Action
            app.showContactEditorById(contactId);

            //Make an Ajax call to the server with fetch method
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toEqual('/api/contacts/' + contactId);
        });

        //The Façade should trigger loading: start when fetching the data from the server
        it('triggers a loading:start event', () => {
            //Arrange
            var callback = jasmine.createSpy('callback');
            //Occurs before the Ajax request to bind a loading:start event on callback
            FakeApp.on('loading:start', callback);
            //Action
            app.showContactEditorById(contactId);
            //Assert
            expect(callback).toHaveBeenCalled();
        });

        //it should stop when the request is fulfilled
        it('triggers a loading:stop event when the contact is loaded', () => {
            //Arrange
            var callback = jasmine.createSpy('callback');
            //Occurs after an Ajax request
            FakeApp.on('loading:stop', callback);
            //Action
            app.showContactEditorById(contactId);
            jasmine.Ajax.requests.mostRecent().respondWith(successOptions);
            //Assert
            expect(callback).toHaveBeenCalled();
        });

        //Finally, it should show the editor
        it('shows the rigth contact', () => {
            //Arrange
            spyOn(FakeContactEditor.prototype, 'showEditor');
            //Action
            //Occurs after an Ajax request
            app.showContactEditorById(contactId);
            jasmine.Ajax.requests.mostRecent().respondWith(successOptions);
            //Assert
            expect(FakeContactEditor.prototype.showEditor).toHaveBeenCalled();
            var args = FakeContactEditor.prototype.showEditor
                .calls.argsFor(0);//returns the arguments passed to call number index
            var model = args[0];
            expect(model.get('id')).toEqual(contactId);
            expect(model.get('name')).toEqual('John Doe');
        });

    });
});
