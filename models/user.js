var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;

//Creating a user model and properties
var usermodel = {
        username: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        createdAt:
        {
            type: Date,
            default: Date.now
        },
        displayName: String,
        bio: String
};

var contactModel = {
        name: String,
        bio: String,
        phones: [{}],
        phone: {
            description: String,
            phone:String
        },
        emails: [{}],
        email: {
            description: String,
            email: String
        },
        addresses: [String],
        address:String,
        facebook: String,
        twitter: String,
        github: String,
        avatars: [{}],
        avatar: {
            file: String,
            url: String
        }   
};

//Defining the user schema
var userSchema =new mongoose.Schema(usermodel);
var contactSchema = new mongoose.Schema(contactModel);

//Dynamic expansion
//userSchema.add({email: 'string'});

/*****
defines instance methods
******/

//display name
userSchema.methods.name = function () {
    //console.log('This is user instace ' + this.displayName);
    //console.log('-------------------------------');
    return this.displayName || this.username;
};

userSchema.methods.printBio = function () {
    console.log('This is user instace bio: ' + this.bio);
    console.log('-------------------------------');
};

//checking the user's password
userSchema.methods.checkPassword = function (guess, done) {
    //console.log("----start check Password-------------");
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
    //console.log('-------------------------------');
};

contactSchema.methods.printName = function () {
    console.log('This is contact instance' + this.name);
    console.log('-------------------------------');
};

/*****
defines static methods
******/
userSchema.statics.print = function () { };

//defining user model and make sure to export
var User = mongoose.model('User', userSchema);
var Contact = mongoose.model('Contact', contactSchema);

/* Check
var rawUser = require('./raw_user.json');
var eric = new User(rawUser);
eric.name();
eric.printBio();
*/

//A do-nothing function for use with the bcrypt module
var noop = function () { };

//define a pre-save action
userSchema.pre('save', function (done) {
    var user = this;
    //Skips this logic if password isn’t modified
    if (!user.isModified('password')) {
        return done();
    }
    //Generates a salt for the hash, and calls the inner function once completed
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err);
        }
        //Hashes the user’s password         
        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }
            //Stores the password
            user.password = hashedPassword;
            console.log('Password modify!!')
            //continues with the saving
            done();
        });
    });
});

module.exports = User;

