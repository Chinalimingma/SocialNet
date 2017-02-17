'use strict';

var _ = require('underscore');
var BackboneValidation = require('backbone-validation');
var Layout = require('../../../common').Layout;
var template = require('../templates/contactEditorForm.tpl');

class ContactForm extends Layout {
    constructor(options) {
        super(options);
        this.template = template;
        this.regions = {
            phones: '.phone-list-container',
            emails: '.email-list-container'
        };
    }

    
    get className() {
        //align labels and groups of form controls in a horizontal layout by adding 
        //.form - horizontal
        return 'form-horizontal';
    }

    get events() {
        return {
            'change input': 'inputChanged',
            'keyup input': 'inputChanged',

            'click #new-phone': 'addPhone',
            'click #new-email': 'addEmail',
            'click #save': 'saveContact',
            'click #cancel': 'cancel'
        };
    }

    /**
     * Extend the serializeData() method to assign default values.
     */
    serializeData() {
        //_.defaults(object, *defaults) Fill the undefined attribute in object with the defaults 
        //object
        return _.defaults(this.model.toJSON(), {
            name: '',
            age: '',
            phone: '',
            email: '',
            address1: '',
            address2: ''
        });
    }

    onRender() {
        BackboneValidation.bind(this);
    }

    addPhone() {
        this.trigger('phone:add');
    }

    addEmail() {
        this.trigger('email:add');
    }
        
    saveContact(event) {
        event.preventDefault();
        /*
        this.model.set('name', this.getInput('#name'));
        this.model.set('phone', this.getInput('#phone'));
        this.model.set('email', this.getInput('#email'));
        this.model.set('address1', this.getInput('#address1'));
        this.model.set('address2', this.getInput('#address2'));
        this.model.set('facebook', this.getInput('#facebook'));
        this.model.set('twitter', this.getInput('#twitter'));
        this.model.set('google', this.getInput('#google'));
        this.model.set('github', this.getInput('#github'));
        */
        this.trigger('form:save', this.model);
    }
    /**
     * view-model bindings
       https://nytimes.github.io/backbone.stickit/docs/annotated/
     * @param event
     */
    //extract the new value from the input
    inputChanged(event) {
        var $target = this.$(event.target);
        var value = $target.val();
        var id = $target.attr('id');        
        this.model.set(id, value);
        //two events are triggered: change and change: <fieldname>
    }

    getInput(selector) {
        return this.$el.find(selector).val();
    }

    cancel() {
        this.trigger('form:cancel');
    }

    // Call the onShow method for each children
    onShow() {
        // Ensure that children exists
        var children = this.children || {};
        _.each(children, child => {
            if (child.onShow) {
                child.onShow();
            }
        });
    }
}

module.exports = ContactForm;