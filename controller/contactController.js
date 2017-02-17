'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var crispy = require('crispy-string');


const ID_LENGTH = 10;
const AVATAR_PATH = './app/avatar';

function makeId() {
    return crispy.base32String(ID_LENGTH);
}

function isValidImage(mimetype) {
    return /jpeg|png|gif|jpg/.test(mimetype);
}

function generateFilename(extension) {
    return crispy.base32String(ID_LENGTH) + extension;
}

function generateFullPath(filename) {
    return AVATAR_PATH + '/' + filename;
}

function generateURLForAvatar(filename) {
    return 'avatar/' + filename; //http://hostname/avatar/filename
}

function getExtension(filename) {
    return path.extname(filename);
    //The path.extname() method returns the extension of the path
}

function removeAvatar(contact) {
    // Remove previous avatar if any
    if (_.has(contact, 'avatar.file')) {
        var currentAvatarPath = generateFullPath(contact.avatar.file);
        //如果给定目录currentAvatarPath存在，就删除它
        if (fs.existsSync(currentAvatarPath)) {
            fs.unlinkSync(currentAvatarPath);//删除文件
        }
    }
}

var contacts = [{
    id: makeId(),
    name: 'John Doe',
    bio:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae efficitur dui, ac pellentesque nisi. Morbi sit amet nibh ante. Aenean at dui sit amet nunc elementum posuere. Fusce mauris eros, scelerisque a velit et, facilisis faucibus magna. Praesent hendrerit lacinia pharetra. Donec cursus odio nisi, maximus aliquam nibh sodales non. Sed at purus non ante efficitur semper vel et mauris.',
    phones: [{
        description: 'home',
        phone: '(333) 364 27364'
    },
        {
            description: 'mobile',
            phone:'(001)123456789'
        }],
    emails: [{
        description: 'personal',
        email: 'john.doe@example.com'
    }, {
            description: 'work',
            email: 'john.doe@acme.com'
        }],
    address1: 'Cuarzo Street 2369',
    facebook: 'https://www.facebook.com/John.Doe',
    twitter: 'https://twitter.com/thejanedoe',
    github: 'https://github.com/abiee',
    avatar: {
        file:"cat.jpg",
        url: 'img/cat.jpg'
    }
}, {
        id: makeId(),
        name: 'Stephen Statler',
        bio: 'Stephen Statler is a writer, public speaker, and consultant working in the'+
        'beacon ecosystem.He trains and advises retailers, venue owners, VCs, and'+
        'makers of beacon software and hardware, and he is a thought leader in the'+
        'beacosystem community.Previously he was the senior director for strategy'+
        'and solutions management at Qualcomm’s Retail Solutions division,'+
        'helping to incubate Gimbal, one of the leading Bluetooth beacons in the'+
        'market. He is also the CEO of Cause Based Solutions, creators of Give the'+
        'Change, which is democratizing philanthropy and enabling non-profit'+
        'supporters to donate the change from charity branded debit cards.They'+
        'are also the developer of The Good Traveler program.'+
        'Stephen was born in the United States, grew up in England, and now'+
        'lives with his wife, two sons, and a dog of uncertain origin in San Diego,'+
        'California.',
        emails: [{
            description: 'personal',
            email: 'jane.doe@example.com'
        }],
        address1: 'Tortilla Street 364',
        facebook: 'https://www.facebook.com/John.Doe',
        twitter: 'https://twitter.com/thejanedoe',
        
        avatar: {
            file: "cat3.jpg",
            url: 'img/cat3.jpg'
        }
    }, {
        id: makeId(),
        name: 'Abiee Alejandro',
        bio: 'Frontend architecture is a collection of tools and processes that'+
             'aims to improve the quality of frontend code while creating a more' +
             'efficient and sustainable workflow.',
        emails: [{
            description: 'personal',
            email: 'abiee@echamea.com'
        }],
        address1: 'Cuarzo 2369',
        facebook: 'https://www.facebook.com/abiee.alejandro',
        twitter: 'https://twitter.com/AbieeAlejandro',
        github: 'https://github.com/abiee',
        avatar: {
            file: "cat4.jpg",
            url: 'img/cat4.jpg'
        }
    }, {
        id: makeId(),
        name: 'Omare',
        bio: 'An architect is defined as someone who designs, plans, and oversees'+
        'the construction of buildings.This is exactly what a frontend architect' +
        'does, except that the end product is a website.And just as an' +
        'architect spends more time drafting up schematics than pouring' +
        'concrete, the frontend architect is more concerned with building' +
        'tools and processes than writing production code.',
        email: 'me@omar-e.com',
        address1: 'Del Árbol street',
        avatar: {
            file: "cat5.jpg",
            url: 'img/cat5.jpg'
        }
    }];

// Extract and set default values of a contact from a standard
// express request object
function extractContactData(req) {
    var result = {};
    var data = req.body;

    var fields = ['name', 'phones', 'emails', 'address1', 'address2',
        'facebook', 'twitter', 'google', 'github'];

    fields.forEach(field => {
        if (data[field]) {
            result[field] = data[field];
        }
    });

    return result;
}

module.exports = {
    showContacts(req, res) {
        res.json(contacts);
    },

    // Insert a new contact JSON into the contacts array
    createContact(req, res) {
        var contact = extractContactData(req);

        //uses a hash table to store all data in memory.
        // Asssign a random id
        contact.id = makeId();
        contacts.push(contact);

        res.status(201).json(contact);
    },

    updateContact(req, res, next) {
        var contactId = req.params.contactId;
        var contact = _.find(contacts, ['id', contactId]);

        if (!contact) {
            res.status(404);
            return next();
        }

        // extractContactData do not alter the contact id
        //通过调用Object.assign函数可以拷贝所有可被枚举的自有属性值到目标对象中
        //Object.assign(target, ...sources)
        contact = Object.assign(contact, extractContactData(req));
        contacts[contactId] = contact;
        res.json(contact);
    },

    // Locates an item in the contacts array with the id attribute equals
    // to the req.params.contactId value
    findContactById(req, res, next) {
        var contactId = req.params.contactId;
        var contact = _.find(contacts, ['id', contactId]);

        if (!contact) {
            res.status(404);
            return next();
        }

        res.json(contact);
    },

    deleteContact(req, res, next) {
        // Ensures that contact exists
        var contactId = req.params.contactId;
        var contact = _.find(contacts, ['id', contactId]);

        if (!contact) {
            res.status(404);
            return next();
        }

        // Drop the object with the given id from the contacts array
        _.remove(contacts, item => item.id === contact.id);
        res.json(contact);
    },

    /**
    multer will attach a files attribute in the req object, which we can inspect to
    retrieve information about the uploaded files
    **/
    uploadAvatar(req, res, next) {
        var contactId = req.params.contactId;
        var filename, fullpath;
        
        // Ensure that user has sent the file, exist req.file
        if (!_.has(req, 'file')) {
            return res.status(400).json({
                error: 'Please upload a file in the avatar field'
            });
        }

        // File should be in a valid format with multer attached
        var metadata = req.file;// req.file is the `avatar` file 
        if (!isValidImage(metadata.mimetype)) {
            res.status(400).json({
                error: 'Invalid format, please use jpg, png or gif files'
            });
            return next();
        }

        // Get target contact from database
        var contact = _.find(contacts, ['id', contactId]);
        //Iterates over elements of collection, returning the first element predicate 
        //returns truthy for.
        if (!contact) {
            res.status(404).json({
                error: 'contact not found'
            });
            return next();
        }

        // Ensure that avatar path exists --如果给定目录不存在，就创建它
        if (!fs.existsSync(AVATAR_PATH)) {//AVATAR_PATH='./app/avatar'
            fs.mkdirSync(AVATAR_PATH);
            console.log('successfully create dir ' + AVATAR_PATH);
            //mkdirSync()，writeFileSync()，readFileSync() 这三个方法是建立目录、写入文件、读取文件的同步版本
        }

        // Ensure unique filename to prevent name colisions
        var extension = getExtension(metadata.originalname);
        do {
            filename = generateFilename(extension);
            fullpath = generateFullPath(filename);
        } while (fs.existsSync(fullpath));//检查指定路径的文件或者目录是否存在
        //if fullpath already exists, then we generate another filename 

        // Remove previous avatar if any, remove avatar file
        removeAvatar(contact);

        // Save the file in disk
        var wstream = fs.createWriteStream(fullpath);
        wstream.write(metadata.buffer);
        wstream.end();

        // Update contact by assingn the url of the uploaded file
        contact.avatar = {
            file: filename,
            url: generateURLForAvatar(filename)
        };
        // Update contacts hash table 由于这里的contacts表的Id是随机产生的，故并没有保存
        contacts[contactId] = contact;

        //Pure API programming, by the user to obtain pictures
        res.json({
            success: true,
            avatar: contact.avatar//http://hostname/avatar/filename
        });
    }
};