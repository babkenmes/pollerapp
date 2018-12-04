﻿var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// User
var User = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase:true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true,
        select: false
    },
    salt: {
        type: String,
        required: true,
        select:false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });


User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

User.methods.resetPassword = function (password) {
    this.salt = crypto.randomBytes(32).toString('base64');    
    this.hashedPassword = this.encryptPassword(password);   
};

module.exports = mongoose.model('User', User);