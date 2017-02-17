'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/emailListItemView.tpl');

class EmailListItemView extends ModelView {
    constructor(options) {
        super(options);
        this.template = template;
    }

    // by default. Wrap labels and controls in .form-group for optimum spacing.
    get className() {
        return 'form-group';
    }
    /**
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
      </div>
  **/

    get events() {
        return {
            'change .description': 'updateDescription',
            'change .phone': 'updateEmail',
            'click a': 'deleteEmail'
        };
    }

    updateDescription() {
        var $el = this.$('.description');
        this.model.set('description', $el.val());
    }

    updateEmail() {
        var $el = this.$('.email');
        this.model.set('email', $el.val());
    }

    deleteEmail(event) {
        event.preventDefault();
        this.trigger('email:deleted', this.model);
    }
}

module.exports = EmailListItemView;