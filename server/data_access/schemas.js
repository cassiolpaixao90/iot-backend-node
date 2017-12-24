"use strict";

import mongoose         from "mongoose";
import Promise          from "bluebird";

const bcrypt    = Promise.promisifyAll(require("bcrypt"));
const Schema    = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type:       String,
        maxLength:  200
    },
    email: { 
        type:       String, 
        require:    true,
        index: {
            unique: true
        },
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
    password: {
        type:       String,
        required:   true,
        match:      /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        minlength:  6
    }
});

UserSchema.pre("save", async (next) => {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const hash = await bcrypt.hashAsync(this.password, 6);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.passwordIsValid =(password) => {
    try {
        return bcrypt.compareAsync(password, this.password);
    }
    catch (err) {
        throw err;
    }
};

export {UserSchema as UserSchema};