//IndexedDB driver for Backbone.
'use strict';

var Backbone = require('backbone');
var crispy = require('crispy-string');
const ID_LENGTH = 10;

//Create base32 string
function makeId() {
    return crispy.base32String(ID_LENGTH);
}

var contacts = [{
    id: makeId(),
    name: 'John Doe',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae efficitur dui, ac pellentesque nisi. Morbi sit amet nibh ante. Aenean at dui sit amet nunc elementum posuere. Fusce mauris eros, scelerisque a velit et, facilisis faucibus magna. Praesent hendrerit lacinia pharetra. Donec cursus odio nisi, maximus aliquam nibh sodales non. Sed at purus non ante efficitur semper vel et mauris.',
    phones: [{
        description: 'home',
        phone: '(333) 364 27364'
    },
        {
            description: 'mobile',
            phone: '(001)123456789'
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
        file: "cat.jpg",
        url: 'img/cat.jpg'
    }
}, {
        id: makeId(),
        name: 'Stephen Statler',
        bio: 'Stephen Statler is a writer, public speaker, and consultant working in the' +
        'beacon ecosystem.He trains and advises retailers, venue owners, VCs, and' +
        'makers of beacon software and hardware, and he is a thought leader in the' +
        'beacosystem community.Previously he was the senior director for strategy' +
        'and solutions management at Qualcomm’s Retail Solutions division,' +
        'helping to incubate Gimbal, one of the leading Bluetooth beacons in the' +
        'market. He is also the CEO of Cause Based Solutions, creators of Give the' +
        'Change, which is democratizing philanthropy and enabling non-profit' +
        'supporters to donate the change from charity branded debit cards.They' +
        'are also the developer of The Good Traveler program.' +
        'Stephen was born in the United States, grew up in England, and now' +
        'lives with his wife, two sons, and a dog of uncertain origin in San Diego,' +
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
        bio: 'Frontend architecture is a collection of tools and processes that' +
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
        bio: 'An architect is defined as someone who designs, plans, and oversees' +
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

class DataStore {
    constructor(options) {        
        this.model = options.model;
        this.collects = contacts;
        this.databaseName = 'contactDB';                
    }
    /**
     * create a record,assigned ID
     * @param model
     */   
    create(record) {
        var defer = Backbone.$.Deferred();
        // Assign an id to new models
        if (!record.id && record.id !== 0) {
            let id = makeId();
            record.set(record.idAttribute, id);
        }
        // Get the database connection, form a database singleton
        this.openDatabase()//Return a Deferred’s Promise object.
            //Open Database success
            .then(db => this.store(db, record))
            //Store completed
            .then(result => defer.resolve(result));
        return defer.promise();        
    }    
    /**
     * Replaces the previous record with the new model data
       Return defer.promise()
     * @param model
     */
    update(record) {
        var defer = Backbone.$.Deferred();

        // Get the database connection
        this.openDatabase()
            .then(db => this.store(db, record))
            .then(result => defer.resolve(result));

        return defer.promise();
    }
    /**
     * Add or put the record in the indexedDB database
       Return defer.promise()
     * @param db   
     * @param model
     */
    store(db, record) {
        var defer = Backbone.$.Deferred();
        // Get the name of the object store
        var storeName = this.model.store;
        //creates a readwrite transaction for the given store name
        var tx = db.transaction(storeName, 'readwrite');
        // Get the object store handler
        var store = tx.objectStore(storeName);
       
        var obj = record.toJSON();
        store.put(obj);

        tx.oncomplete = function () {
            //Use the resolve method of the deferred object to specify the 
            //resolved (completed) callback function
            defer.resolve(obj);
        };

        tx.onerror = function () {
            //call the callback function specified by the fail () method
            defer.reject(obj);
        };

        return defer.promise();
    }
    /**
     * Delete a record
       Return defer.promise()
     * @param model
     */
    destroy(model) {
        var defer = Backbone.$.Deferred();

        // Get the database connection
        this.openDatabase().then(function (db) {
            // Get the name of the object store
            let storeName = model.store;

            // Get the store handler
            var tx = db.transaction(storeName, 'readwrite');
            var store = tx.objectStore(storeName);
            // Delete object from the database
            store.delete(model.id);

            //Relay the success or failure state of transaction function.
            //invoke callback queues,
            tx.oncomplete = function () {
                defer.resolve(model.toJSON());     //call doneCallbacks
            };

            tx.onerror = function () {
                defer.reject(model.toJSON());      //call failCallbacks
            };
        });
        return defer.promise();
    }
    /**
     * Get all the models stored on an object store
       put all items in an array
       Return defer.promise()
     * @param model
     */
    findAll(model) {
        var defer = Backbone.$.Deferred();

        // Get the database connection
        this.openDatabase().then(db => {
            let result = [];

            // Get the name of the object store
            let storeName = model.store;
           
            // Get the store handler
            let tx = db.transaction(storeName, 'readonly');
            let store = tx.objectStore(storeName);

            // Open the query cursor
            let request = store.openCursor();

            // onsuccess callback will be called for each record found for the query
            request.onsuccess = function () {
                let cursor = request.result;

                // Cursor will be null at the end of the cursor
                if (cursor) {
                    result.push(cursor.value);

                    // Go to the next record
                    cursor.continue();
                } else {
                    defer.resolve(result);
                }
            };
        });

        return defer.promise();
    }
    /**
     * Obtain single model by querying the model ID
     * @param model
     */
    find(model) {
        var defer = Backbone.$.Deferred();

        // Get the database connection
        this.openDatabase().then(db => {
            // Get the name of the collection/store
            let storeName = model.store;

            // Get the store handler
            let tx = db.transaction(storeName, 'readonly');
            let store = tx.objectStore(storeName);

            // Open the query cursor
            let request = store.openCursor(IDBKeyRange.only(model.id));

            request.onsuccess = function () {
                let cursor = request.result;

                // Cursor will be null if record was not found
                if (cursor) {
                    defer.resolve(cursor.value);
                } else {
                    defer.reject();
                }
            };
        });
        return defer.promise();
    }

    /**
     * Initialize the IndexDB
       Name the database singleton according to model.store       
       Return defer.promise()
     */
    openDatabase() {
        var defer = Backbone.$.Deferred();

        // If a IndexedDB is already active use it, otherwise create a new
        //IndexedDB database
        if (this.db) {
            //Open the database into the store operation
            defer.resolve(this.db); 
            
        } else {
            //Use a different version number to create new datebase.
            let request = indexedDB.open(this.databaseName, 1);

            //modify the database.
            request.onupgradeneeded = () => {
                let db = request.result;
                let storeName = this.storeName;
                this.createStores(db, storeName);
            };
            
            request.onsuccess = () => {
                // Cache recently opened connection
                this.db = request.result;
                defer.resolve(this.db);
            };
        }

        return defer.promise();//Return a Deferred's Promise object.
    }

    /**
     *Create a store and add data
     * @param db
     */
    createStores(db, storeName) {

        //return a store handler
        var store = db.createObjectStore(storeName, { keyPath: 'id' });
        
        this.collects.forEach(model => { 
            //insert new records
            store.put(model);
        });

        //query the objects by a different attribute,create indexes in the store
        /*
        var emailIndex = store.createIndex('by_email', 'email', {
            unique: true
        });

        var nameIdext = store.createIndex('by_name', 'name');
        */
    }
}

module.exports = DataStore;

/**
jQuery.Deferred() method can register multiple callbacks(success, fail, error, progress)
into callback queues, invoke callback queues, and relay the success or failure state of
any synchronous or asynchronous function.

Queries are to be done by opening cursors with the openCursor() method. The first
argument of the openCursor() method is a query that should be an IDBKeyRange
object:
• only(value): It looks for the value, such as an == operation
• lower(value): It looks for the values lower or equal to the value, such as a
<= operation
• lowerOpen(value): It looks for values lower than the value, such as
a < operation
• upper(value): It looks for values greater than or equal to the value, such as
a >= operation
• upperOpen(value): It looks for values greater than the value, such as
a > operation


Backbone.$.Deferred()
开发网站的过程中，我们经常遇到某些耗时很长的javascript操作。其中，既有异步的操作（比如ajax
读取服务器数据），也有同步的操作（比如遍历一个大型数组），它们都不是立即能得到结果的。
通常的做法是，为它们指定回调函数（callback）。即事先规定，一旦它们运行结束，应该调用哪些函数。
但是，在回调函数方面，jQuery的功能非常弱。为了改变这一点，jQuery开发团队就设计了deferred对象。
简单说，deferred对象就是jQuery的回调函数解决方案。在英语中，defer的意思是"延迟"，所以
deferred对象的含义就是"延迟"到未来某个点再执行。
它解决了如何处理耗时操作的问题，对那些操作提供了更好的控制，以及统一的编程接口。它的主要功能，
可以归结为四点。
1，ajax操作的链式写法
2. 指定同一操作的多个回调函数
3，为多个操作指定回调函数
4，普通操作的回调函数接口
   deferred对象的最大优点，就是它把这一套回调函数接口，从ajax操作扩展到了所有操作。
   也就是说，任何一个操作----不管是ajax操作还是本地操作，也不管是异步操作还是同步操作----
   都可以使用deferred对象的各种方法，指定回调函数。
5，deferred.resolve()方法和deferred.reject()方法
   jQuery规定，deferred对象有三种执行状态----未完成，已完成和已失败。
   --如果执行状态是"已完成"（resolved）,deferred对象立刻调用done()方法指定的回调函数；
   deferred.resolve()的意思是，将dtd对象的执行状态从"未完成"改为"已完成"，从而触发done()方法。
   --如果执行状态是"已失败"，调用fail()方法指定的回调函数；
   deferred.reject()方法，作用是将dtd对象的执行状态从"未完成"改为"已失败"，从而触发fail()方法
   --如果执行状态是"未完成"，则继续等待，或者调用progress()方法指定的回调函数
   或者调用progress()方法指定的回调函数（jQuery1.7版本添加）

jQuery提供了deferred.promise()方法。它的作用是，在原来的deferred对象上返回另一个deferred对象
后者只开放与改变执行状态无关的方法（比如done()方法和fail()方法），屏蔽与改变执行状态有关的方法
（比如resolve()方法和reject()方法），从而使得执行状态不能被改变。

deferred.then(): 有时为了省事，可以把done()和fail()合在一起写，这就是then()方法

**/