// spec/apps/contacts/collections/contactCollectionSpec.js

var ContactCollection = require('../../../../app/js/apps/contacts/collections/contactCollection');
describe('ContactApp Collection contacts', () => {
    describe('has the right properties test', ()=>{
        it('the rigth urlRoot', () => {
            var collection = new ContactCollection();
            expect(collection.url).toEqual('/api/contacts');
        });
    });
});
