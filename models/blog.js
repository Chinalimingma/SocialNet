//http://mongoosejs.com/docs/guide.html
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Permitted SchemaTypes: String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array
blogModel = {
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
};

var blogSchema = new Schema(blogModel);

//Creating a Class model
var Blog = mongoose.model('Blog', blogSchema);

/* Defining instance methods */

blogSchema.methods.displayauthor = function () {
    return this.author;
};

/* Defining static methods */
blogSchema.statics.findBytitle = function (title, cb) { };

/* Defining query helper functions */
blogSchema.query.bytitle = function (title) {
    return this.find({ title: new RegExp(title, 'i') });
};

/* Defining indexes*/
//blogSchema.index({ title: 1, author: -1 }); 

