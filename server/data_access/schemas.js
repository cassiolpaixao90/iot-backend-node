"use strict";

import mongoose             from "mongoose";
import Promise              from "bluebird";
import uniqueValidator      from "mongoose-unique-validator";
import crypto               from "crypto";
import jwt                  from "jsonwebtoken";
import { secret }           from "../configurations/indexConfig";


// const bcrypt    = Promise.promisifyAll(require("bcrypt"));
const Schema     = mongoose.Schema;
const UserSchema = new Schema({
   
    name: {
        type:       String,
        maxLength:  200,
        required:   true,
        match:      /^[a-zA-Z0-9]+$/
    },
    email: { 
        unique:     true,
        type:       String, 
        require:    true,
        index:      true,
        match:      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    },
    role: {
        type:       String,
        default:    'user'
    },
    created: {
        type:       Date,
        required:   true,
        default:    new Date()
    },
    hash: String,
    salt: String
});

// password: {
//     type:       String,
//     required:   true,
//     match:      /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
//     minlength:  6
// },

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
UserSchema.methods.generateJWT = function() {
    try {
        const today     = new Date();
        const exp       = new Date(today);
        exp.setDate(today.getDate() + 60);
  
        return jwt.sign({
            id: this._id,
            name: this.name,
            exp: parseInt(exp.getTime() / 1000),
        }, secret);    

    } catch (error) {
        throw err;
    }
  };
  
  UserSchema.methods.toAuthJSON = function(){
    return {
      name:     this.name,
      email:    this.email,
      token:    this.generateJWT()
    };
  };

export {UserSchema as UserSchema};