'use strict';

var App = require('../../../app');
var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactViewAbout.tpl');


class ContactAbout extends ModelView {
    //Views take only a single options argument when instantiated.
    constructor(options) {
        super(options);
        this.template = template;
    }
    //put DOM in panel box.
    get className() {
        return 'panel panel-simple';
    } 

    get events() {
        return {
            'click #back': 'goToList',
            'click #delete': 'deleteContact',
            'click #edit': 'editContact'
        };
    }

    /**
     *The go back button is simple URL redirections and can be implemented directly in the view.
     */
    goToList() {
        App.router.navigate('contacts', true);
    }

    /**
     * delegate the deletion process to the controller; views should not handle that business logic.
     */
    deleteContact() {
        this.trigger('contact:delete', this.model);
    }

    /**
     * The edit button is simple URL redirections and can be implemented directly in the view.
     */
    editContact() {
        var contactId = this.model.get('id');
        App.router.navigate(`contacts/edit/${contactId}`, true);
    }
}

module.exports = ContactAbout;
