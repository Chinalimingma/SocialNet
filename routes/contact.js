var express = require('express');
var router = express.Router();
var multer = require('multer');
var controller = require('../controller/contactController');
var auth = require('../controller/oauth2Middleware');
var upload = multer();

//Routing is a way to map requests to specific handlers depending on 
//their URL and HTTP verb.
router.post('/oauth/token', auth.authenticate);

// Configure all available routes--create, get, update, and delete
router.post('/contacts/',
    auth.requireAuthorization, controller.createContact);       //contact.save for a new Model
router.get('/contacts/',
    auth.requireAuthorization, controller.showContacts);        //contacts.fetch
router.get('/contacts/:contactId',
    auth.requireAuthorization, controller.findContactById);     //contact.fetch
router.put('/contacts/:contactId',
    auth.requireAuthorization, controller.updateContact);       //contact.save for an existing Model
router.delete('/contacts/:contactId',
    auth.requireAuthorization, controller.deleteContact);       //contact.destroy

router.post('/contacts/:contactId/avatar',
    auth.requireAuthorization,
    //Accept a single file with the name fieldname.
    // req.file is the `avatar` file 
    // req.body will hold the text fields, if there were any
    upload.single('avatar'),
    controller.uploadAvatar
);

module.exports = router;