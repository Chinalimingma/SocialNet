'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BackboneValidation = require('backbone-validation');

class Contact extends Backbone.Model {

    constructor(options) {
        super(options);       
        this.store = 'contacts';//for indexDB store name

        this.validation = {
            name: {
                required: true,
                minLength: 3
            }
        };        
    }

    //Server-side endpoint for a Contact Model, make GET to the the urlRoot
    get urlRoot() {
        return '/api/contacts';
    };
    
    //When a model instance is created, any non-existent or unspecified attributes 
    //are created and set to their default values.
    get defaults() { 
        return { 
            name: '',  // new Contact.attributes.name
            bio:'',
            phone: '',
            email: '',
            address1: '',
            address2: '',
            facebook: '',
            twitter: '',
            google: '',
            github: '',
            avatar: null // contact.attributes.avatar
        };
    }
        
    uploadAvatar(imageBlob, options) {
        // Create a form object to emulate a multipart/form-data 
        var formData = new FormData();
        //the field name avatar that is expecting the server
        formData.append('avatar', imageBlob);

        var ajaxOptions = {
            url: '/api/contacts/' + this.get('id') + '/avatar',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false, 
            processData: false  
        };

        options = options || {};

        // Copy options to ajaxOptions
        _.extend(ajaxOptions, _.pick(options, 'success', 'error'));
       /**https://mobiarch.wordpress.com/2012/08/21/html5-file-upload-with-progress-bar-using-jquery/ **/
        // Attach a progress handler only if is defined
        if (options.progress) {
            //xhr – This method actually creates the XMLHttpRequest object.
            ajaxOptions.xhr = function () {
                /**
                Overwrite the original xhr() function called by jQuery to get an
                XMLHttpRequest object instance; this allow us to listen for the progress
                event triggered by the browser while uploading the file.
                **/
                var myXhr = $.ajaxSettings.xhr();
                /*
                Progress events exist for both download and upload transfers.
                The download events are fired on the XMLHttpRequest object itself,
                The upload events are fired on the XMLHttpRequest.upload object
                */
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', event => {
                        let length = event.total;
                        let uploaded = event.loaded;
                        let percent = (uploaded / length)*100;

                        options.progress(length, uploaded, percent);
                    }, false);
                } else {
                    console.log("Uploadress is not supported.");
                }

                return myXhr;
            };
        }

        $.ajax(ajaxOptions);
    }

    
    //Sends to Server, correspond to save method
    toJSON() {
        var result = Backbone.Model.prototype.toJSON.call(this);

        if (result.phones && result.phones.length > 0) {
            result.phone = result.phones[0].phone;
        }

        if (result.emails && result.emails.length > 0) {
            result.email = result.emails[0].email;
        }

        return result;
    }
}

module.exports = Contact;

   