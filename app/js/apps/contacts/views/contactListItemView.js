'use strict';

var App = require('../../../app');
var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactListItem.tpl');

class ContactListItemView extends ModelView {
    constructor(options) {
        super(options);
        this.template = template;
    }

    //Item container class in collectionList container, define size
    get className() {
        return 'col-xs-12 col-sm-6 col-md-3';
    }
    
    get events() {
        return {
            'click #delete': 'deleteContact',
            'click #view': 'viewContact'
        };
    }

    /**
     * var options = ['model', 'collection', 'el', 'id', 'attributes'
       , 'className', 'tagName', 'events'];
     * @param options
     */
    initialize(options) {
        this.listenTo(options.model, 'change', this.render);
    }

    deleteContact() {
        this.trigger('contact:delete', this.model);
    }

    /*
        Because the View button is simpler than the Delete, we can redirect the user to the
        contact list from the view; note that delegating this very simple task to the controller
        will add more overhead without benefit.
    */
    viewContact() {
        var contactId = this.model.get('id');
        App.router.navigate(`contacts/view/${contactId}`, true);
    }
}

module.exports = ContactListItemView;