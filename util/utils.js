'use strict';
import crypto                         from 'crypto';

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
exports.genaratePassword = function(password, salt){
    const hash = crypto.createHmac('sha512')
                .update(salt + password, 'utf8')
                .hash.digest('hex');
    return {
        passwordHash    :hash
    };
};
