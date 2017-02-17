'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const TTL = 15 * MINUTES;

function getStore(model) {
    return model.dataStore;
}

function cacheExpire(data) {
    if (data && data.fetchedAt) {
        let now = new Date();
        let fetchedAt = new Date(data.fetchedAt);
        let difference = now.getTime() - fetchedAt.getTime();

        return difference > TTL;
    }
    return false;
}
/**
 * Has model.datastore or model.id or datastore data expires,
   return null
 * @param model
 */
function getCachedModel(model) {
    var store = getStore(model);

    // If model does not support localStorage cache or is a collection
    if (!store && !model.id) {
        return null;
    }

    var data = store.find(model);

    //When the cache expires, it removes the model from the cache and returns
    //null to force a server fetch.
    if (cacheExpire(data)) {
        dropCache(store, model);
        data = null;
    }
    return data;
}

function updateCache(store, model) {
    // Ignore if cache is not supported for the model
    if (store) {
        var cachedModel = store.find(model);

        // Use fetchedAt attribute mdoel is already cached
        if (cachedModel && cachedModel.fetchedAt) {
            model.set('fetchedAt', cachedModel.fetchedAt);
        } else {
            model.set('fetchedAt', new Date());
        }

        store.update(model);
    }
}

function dropCache(store, model) {
    // Ignore if cache is not supported for the model
    if (store) {
        store.destroy(model);
    }
}

/**
 *store the response data or drop the model in cache by method
 * @param method
 * @param store
 * @param model
 */
function cacheResponse(method, store, model) {
    if (method !== 'delete') {
        updateCache(store, model);
    } else {
        dropCache(store, model);
    }
}

/*
Package the Backbone.sync function to the following function, and as the first parameter,
decide whether to return the implementation of the Backbone.sync function,
depending on the condition
*/
module.exports = _.wrap(Backbone.sync, (sync, method, model, options) => {
    var store = getStore(model);

    // Try to read from cache store
    if (method === 'read') {
        let cachedModel = getCachedModel(model);

        //If the cacheModel is empty, return Backbone.sync function
        if (cachedModel) {
            let defer = Backbone.$.Deferred();
            //Backbone.$.Deferred()使用特定对象作为其DOM/Ajax库, $.deferred对象就是jQuery
            //的回调函数解决方案的延迟对象, 如果执行状态是"已完成" deferred.resolve, 
            //deferred对象立刻调用done()方法指定(success方法)的回调函数,并传入参数cachedModel
            defer.resolve(cachedModel);

            if (options && options.success) {
                options.success(cachedModel);
            }
            /**
            deferred.promise()方法在原来的deferred对象上返回另一个deferred对象，
            后者只开放与改变执行状态无关的方法（比如done()方法和fail()方法），屏蔽与改变执行
            状态有关的方法（比如resolve()方法和reject()方法），从而使得执行状态不能被改变。
            **/
            return defer.promise();
        }
    }

    //为了省事，可以把done()和fail()合在一起写，这就是then()方法
    //return the server directly to get the data ,here sync is the first parameter
    return sync(method, model, options).then((data) => {
        // When getting a collection data is an array, if is a model is a single object.
        // Ensure that data is always an array
        if (!_.isArray(data)) {
            data = [data];
        }

        data.forEach(item => {
            let model = new Backbone.Model(item);
            //store the response in localStorage for future use
            cacheResponse(method, store, model);
        });
    });
});