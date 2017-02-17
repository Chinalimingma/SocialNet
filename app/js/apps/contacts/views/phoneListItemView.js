'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/phoneListItemView.tpl');

class PhoneListItemView extends ModelView {
    constructor(options) {
        super(options);
        this.template = template;
    }

    //Wrap labels and <input>, <textarea>, and <select> controls in .form-group for optimum spacing.
    get className() {
        return 'form-group';
    }

    get events() {
        return {
            'change .description': 'updateDescription',
            'change .phone': 'updatePhone',
            'click a': 'deletePhone'
        };
    }

    updateDescription() {
        var $el = this.$('.description');
        this.model.set('description', $el.val());
    }

    updatePhone() {
        var $el = this.$('.phone');
        this.model.set('phone', $el.val());
    }

    deletePhone(event) {
        event.preventDefault();
        this.trigger('phone:deleted', this.model);
    }
}

module.exports = PhoneListItemView;