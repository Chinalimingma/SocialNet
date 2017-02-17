'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BackboneValidation = require('backbone-validation');
var swal = require('sweetalert');
var noty = require('noty');
var Region = require('./common').Region;
//var DataStore = require('./indexedDB/dataStore');

// Initialize all available routes
require('./apps/contacts/router');
require('./apps/login/router');

// General routes non sub-application dependant
class DefaultRouter extends Backbone.Router {
    constructor(options) {
        super(options);
        this.routes = {
            '': 'defaultRoute',
            'logout': 'logout'
        };
        //start Backbone.history, bind all defined routes to Backbone.history
        this._bindRoutes();
    }

    // Redirect to subapp by default URL
    defaultRoute() {
        //trigger: true if you wish to have the route callback be fired
        this.navigate('contacts', true);
    }

    // Drop session data
    logout() {
        App.dropAuth();
        this.navigate('login', true);
    }
}
/**
 * Managing the subapplications, bootstrapping the whole application,
   delegate common tasks and a communication channel between the subapplications.
 */
var App = {
    
    start() {                
        // The common place where sub-applications will be showed
        //<div id="main"class=" container"></div>
        App.mainRegion = new Region({ el: '#main' });

        //App.navRegion = new Region({el: '#nav'});

        this.initializePlugins();

        // Load authentication data
        this.initializeAuth();

        // Create a global router to enable sub-applications to redirect to other URLs
        App.router = new DefaultRouter();
        Backbone.history.start();
    },

    // Only a subapplication can be running at once, destroy any
    // current running subapplication and start the asked one
    startSubApplication(SubApplication) {
        // Do not run the same subapplication twice
        if (this.currentSubapp && this.currentSubapp instanceof SubApplication) {
            return this.currentSubapp;
        }

        // Destroy any previous subapplication if we can
        if (this.currentSubapp && this.currentSubapp.destroy) {
            this.currentSubapp.destroy();
        }

        // Run subapplication
        this.currentSubapp = new SubApplication({ region: App.mainRegion });
        return this.currentSubapp;
    },

    initializePlugins() {
        //PNotify.prototype.options.styling = 'bootstrap3';
    },

    //The following methods can be grouped into the help folder
    successMessage(message) {
        var options = {
            title: 'Success',
            type: 'success',
            text: message,
            confirmButtonText: 'Okay'
        };
        swal(options);
    },

    errorMessage(message) {
        var options = {
            title: 'Error',
            type: 'error',
            text: message,
            confirmButtonText: 'Okay'
        };
        swal(options);
    },

    askConfirmation(message, callback) {
        var options = {
            title: 'Are you sure?',
            // Show the warning icon
            type: 'warning',
            text: message,
            // By default the cancel button is not shown
            showCancelButton: true,
            confirmButtonText: 'Yes, do it!',
            // Overwrite the default button color
            confirmButtonColor: '#5cb85c',
            cancelButtonText: 'No'
        };

        // Show the message
        swal(options, function (isConfirm) {
            callback(isConfirm);
        });
    },

    notifySuccess(message) {
        new noty({
            text: message,
            layout: 'topRight',
            theme: 'relax',
            type: 'success',
            timeout: 3000 // close automatically
        });
    },

    notifyError(message) {
        new noty({
            text: message,
            layout: 'topRight',
            theme: 'relax',
            type: 'error',
            timeout: 3000 // close automatically
        });
    },
    // Load authorization data from sessionStorage
    initializeAuth() {
        var authConfig = sessionStorage.getItem('auth');

        if (!authConfig) {
            return window.location.replace('/#login');
        }

        var splittedAuth = authConfig.split(':');
        var type = splittedAuth[0];
        var token = splittedAuth[1];

        this.setAuth(type, token);
    },
    // Save an authentication token
    saveAuth(type, token) {
        var authConfig = type + ':' + token;

        sessionStorage.setItem('auth', authConfig);
        this.setAuth(type, token);
    },

    // Remove authorization token
    dropAuth() {
        sessionStorage.removeItem('auth');
        this.setupAjax(null);
    },

    // Set an authorization token
    setAuth(type, token) {
        var authString = type + ' ' + token;
        this.setupAjax(authString);
    },

    // Set Authorization header for authentication
    setupAjax(authString) {
        var headers = {};

        if (authString) {
            headers = {
                Authorization: authString
            };
        }

        //Determines res.status (401) to go to login
        Backbone.$.ajaxSetup({
            statusCode: {
                401: () => {
                    App.router.navigate('login', true);
                }
            },
            headers: headers
        });
    }
};

//The Backbone.Validation.callbacks contains two methods: valid and invalid.
//implementation globally 
//https://gist.github.com/driehle/2909552
_.extend(BackboneValidation.callbacks, {
    valid(view, attr) {
        var $el = view.$('#' + attr);
        if ($el.length === 0) {
            $el = view.$('[name~=' + attr + ']');
        }

        // If input is inside an input group, $el is changed to
        // remove error properly
        if ($el.parent().hasClass('input-group')) {
            $el = $el.parent();
        }

        var $group = $el.closest('.form-group');
        $group.removeClass('has-error')
            .addClass('has-success');

        var $helpBlock = $el.next('.help-block');
        if ($helpBlock.length === 0) {
            $helpBlock = $el.children('.help-block');
        }
        $helpBlock.slideUp({
            done: function () {
                $helpBlock.remove();
            }
        });
    },

    invalid(view, attr, error) {
        var $el = view.$('#' + attr);
        if ($el.length === 0) {
            $el = view.$('[name~=' + attr + ']');
        }

        $el.focus();

        var $group = $el.closest('.form-group');
        $group.removeClass('has-success')
            .addClass('has-error');

        // If input is inside an input group $el is changed to
        // place error properly
        if ($el.parent().hasClass('input-group')) {
            $el = $el.parent();
        }

        // If error already exists and its message is different to new
        // error's message then the previous one is replaced,
        // otherwise new error is shown with a slide down animation
        if ($el.next('.help-block').length !== 0) {
            $el.next('.help-block')[0].innerText = error;
        } else if ($el.children('.help-block').length !== 0) {
            $el.children('.help-block')[0].innerText = error;
        } else {
            var $error = $('<div>')
                .addClass('help-block')
                .html(error)
                .hide();

            // Placing error
            if ($el.prop('tagName') === 'div' && !$el.hasClass('input-group')) {
                $el.append($error);
            } else {
                $el.after($error);
            }

            // Showing animation on error message
            $error.slideDown();
        }
    }
});

// Allow infrastructure application to listen and trigger events, as a communication channel
_.extend(App, Backbone.Events);

//Keep modular
module.exports = App;

/**
var store = new DataStore();
Backbone.sync = function (method, model, options) {
    var response;
    var defer = Backbone.$.Deferred();

    switch (method) {
        case 'read':
            if (model.id) {
                response = store.find(model);
            } else {
                response = store.findAll(model);
            }
            break;

        case 'create':
            response = store.create(model);
            break;

        case 'update':
            response = store.update(model);
            break;

        case 'delete':
            response = store.destroy(model);
            break;
    }

    response.then(function (result) {
        if (options && options.success) {
            options.success(result);
            defer.resolve(result);
        }
    });

    return defer.promise();
};


There are two different approaches for Backbone.Router
1.hash-based routing: call Backbone.history.start()
2.HTML5 pushState routing: call Backbone.history.start({pushState: true})
  HTML5 pushState routing technology users can't see hashes in URLs.

Route method
The route method of Routers allows you to define a new route at any time.
The main advantage of using the route method is that you can apply logic to your
routes. For instance, let's say you have several routes on your site that are only for
administrators. If your t can check an isAdmin attribute of a user Model, then it can
use this attribute to dynamically add or remove these administrator-only routes
when the Router class is initialized, as shown here:
    // NOTE: In a real case user data would come from the server
    var user = new Backbone.Model({isAdmin: true});
    SiteRouter = new Backbone.Router({
        initialize: function(options) {
            if(user.get('isAdmin')) {
                this.addAdminRoutes();
            }
        },
        addAdminRoutes: function() {
            this.route('adminPage1', 'adminPage1Route');
            this.route('adminPage2', 'adminPage2Route');
            // etc.
        }
    });



404s and other errors
The Backbone.Router class will just do nothing, by default. This means that if you want to have a
404 page on your site, you'll have to create it yourself.
One way to do this is to rely on the start method. This method returns true or
false depending on whether any matching routes are found for the current URL:
    if (!Backbone.history.start()) {
    // add logic to handle the "404 Page Not Found" case here
    }
However, since that method will only be called once, when the page is first loaded, it
won't allow you to catch nonmatching routes that occur after the page is loaded. To
catch these cases, you'll need to define a special 404 route, which you can do using
the routing string's splat syntax:
    var SiteRouter = Backbone.Router.extend({
        initialize: function(options) {
            this.route('normalRoute/:id', 'normalRoute');
            this.route('*nothingMatched', 'pageNotFoundRoute');
        },

        pageNotFoundRoute: function(failedRoute) {
            alert( failedRoute + ' did not match any routes');
        }
    });

Routing events
Normally, route-based logic is handled by the Router class itself. However,
sometimes you may wish to trigger additional logic. For instance, you may want
to add a certain element to the page whenever the user visits one of several routes.
In such a case, you can take advantage of the fact that Backbone triggers events
each time routing occurs, allowing you to listen and respond to route changes
from outside the Router class itself.
You can listen for routing events the same way as events in Models and
Collections, by using the on method, as follows:
    var router = new Backbone.Router();
    router.on('route:foo', function() {
    // do something whenever the route "foo" is navigated to
    });
The following table shows the three different routing events that you can listen for
on a Router class:
    Event name      Trigger

    route           This is triggered when any route is matched
    route:name      This is triggered when the route with the specified name is matched
    all             This is triggered when any event is triggered on the Router class

In addition, Backbone also provides a route event that you can listen to on the
Backbone.history object, as follows:
    Backbone.history.on('route', function() { ... });
The advantage of listening to history instead of a particular Router is that it will
catch events from all the Routers on your site, instead of just a particular one.

**/
