'use strict';

var _ = require('underscore');
var crispy = require('crispy-string');

const ID_LENGTH = 10;

function generateId() {
    return crispy.base32String(ID_LENGTH);
}
/**
 * The DataStore object is responsible to transform models into strings to be
   stored in localStorage
 */
class DataStore {
    constructor(name) {//name is the string 
        this.name = name;

        // Keep track of all ids stored for a particular collection
        this.index = this.getIndex();
    }

    //return a index array
    getIndex() {
        var index = localStorage.getItem(this.name);
        return (index && index.split(',')) || [];
    }

    //return model
    create(model) {
        // Assign an id to new models
        if (!model.id && model.id !== 0) {
            model.id = generateId();
            model.set(model.idAttribute, model.id);
            /** model.idAttribute
            一个model的唯一标示符，被储存在id属性下。如果使用一个不同的唯一的key直接和后端通
            信。可以设置Model的 idAttribute 到一个从key到id 的一个透明映射中。
            **/
        }

        // Save model in the store with an unique name,
        // e.g. collectionName-modelId
        localStorage.setItem(
            //The itemName() function generates a key that is to be used in localStorage
            //given the model ID;
            this.itemName(model.id)//this.name + '-' + id
            //the serialize()method transforms a model into a JSON string that is ready to
            //be stored in localStorage
          , this.serialize(model) //JSON.stringify(model.toJSON())
        );  //model.toJSON() 返回model.attributes 浅拷贝副本的 JSON 字符串化形式

        // Keep track of stored id
        this.index.push(model.get(model.idAttribute));//=>model.id
        //the index attribute in DataStore tracks all the available IDs so that we should
        //push the model ID in the index.
        this.updateIndex();

        // Return stored model
        return this.find(model);
    }

    // Save the ids comma separated for a given collection
    updateIndex() {
        localStorage.setItem(this.name, this.index.join(','));//专列一项为索引
    }

    /**
     * If you call the setItem() method with an existent key on localStorage, the previous
        value is overwritten with the new one, the net effect is an update operation.
     * @param model
     */
    update(model) {
        // Overwrite the data stored in the store, actually makes the update
        localStorage.setItem(
            this.itemName(model.id)
          , this.serialize(model)
        );

        // Keep track of the model id in the collection
        var modelId = model.id.toString();
        //indexOf 返回value在该 array 中的索引值，如果value不存在 array中就返回-1
        if (_.indexOf((this.index, modelId)) >= 0) {
            this.index.push(modelId);
            this.updateIndex();
        }

        // Return stored model
        return this.find(model);
    }

    serialize(model) {
        return JSON.stringify(model.toJSON());
    }

    /**
     * When you are looking for a model, you need to set the ID of the model and call
    the fetch() method on it in order to retrieve the data from a server.
     * @param model
     */
    find(model) {
        return this.deserialize(
            //get the data from localStorege with an ID built with the itemName() method
            localStorage.getItem(this.itemName(model.id))
        );
    }

    //Return a array
    findAll() {
        var result = [];

        // Get all items with the id tracked for the given collection
        for (let i = 0, id, data; i < this.index.length; i++) {
            id = this.index[i];
            data = this.deserialize(localStorage.getItem(
                this.itemName(id)
            ));

            if (data) {
                result.push(data);
            }
        }

        return result;
    }

    deserialize(data) {
        return data ? JSON.parse(data) : null;
    }

    destroy(model) {
        // Remove item from the store
        localStorage.removeItem(this.itemName(model.id));

        // Rmoeve id from tracked ids
        var modelId = model.id.toString();
        for (let i = 0; i < this.index.length; i++) {
            if (this.index[i] === modelId) {
                this.index.splice(i, 1);
            }
        }
        this.updateIndex();

        return model;
    }
    //To prevent collision
    itemName(id) {
        return this.name + '-' + id;
    }
}

module.exports = DataStore;