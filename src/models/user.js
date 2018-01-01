'use strict';

import mongoose         from "mongoose";

const Schema     = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type:       String,
        maxLength:  200,
        required:   true
    },
    email: {
        unique:     true,
        type:       String,
        require:    true,
        index:      true,
        match:      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    },
    roles: [{
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }],
    created_at: {
        type:       Date,
        required:   true,
        default:    new Date()
    },
    update_at: {
        type:       Date,
        required:   true,
        default:    new Date()
    },
    password: String,
    salt: String
    
});


export {UserSchema as UserSchema};