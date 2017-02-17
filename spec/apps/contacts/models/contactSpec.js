/**
 * The most basic test is to ensure that models and collections have the right properties
    set in order to prevent accidental changes in its properties.
 */
// spec/apps/contacts/models/contactSpec.js
var Contact = require('../../../../app/js/apps/contacts/models/contact');

describe('ContactApp model contact', () => {
    //create test suites
    describe('creating a new contact test', () => {
        //Action
        var contact = new Contact();
        //make specs
        it('verify properties that has the default values', () => {            
            //Assert
            expect(contact.get('name')).toEqual('');
            expect(contact.get('phone')).toEqual('');
            expect(contact.get('email')).toEqual('');
            expect(contact.get('address1')).toEqual('');
            expect(contact.get('address2')).toEqual('');
            expect(contact.get('avatar')).toEqual(null);
        });

        it('verify url that has the rigth value', () => {
            //Assert
            expect(contact.url()).toEqual('/api/contacts');
        });
    });   
});