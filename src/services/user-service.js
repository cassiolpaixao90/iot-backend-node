import {getUserModel}       from "../data_access/modelFactory";
import repository           from "../repositories/user-repository";
import jwt                  from "jsonwebtoken";
import crypto               from 'crypto';

const generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

const decodeToken = async (token) => {
    return await jwt.verify(token, global.SALT_KEY);
}

const cryptoPassword = (password) => {
    let salt        = Math.round((Date.now() * Math.random())) + '';
    let newHash     = crypto.createHash('sha512')
                                   .update(salt +  password, 'utf8')
                                   .digest('hex');

    return {
        salt   : salt,
        newHash: newHash
    }
}

const descrypPassword = (user, password) => {
    const newHash   =  crypto.createHash('sha512')
                                     .update(user.salt + password, 'utf8')
                                     .digest('hex');
    return {
        newHash: newHash
    }                                     
}

exports.save = async (data) => {

    try {
        
        const User           = await getUserModel();
        const existingUser   = await repository.getByEmail(data.email, User);

        if (existingUser) {
            return true;
        }

        const newPassword = cryptoPassword(data.password);
        data.password = newPassword.newHash;
        data.salt = newPassword.salt;
        await repository.create(data, User);
    }
    catch(e){
        return "Failed to process your request";
    }
};

exports.authenticate =  async (data) => {

    try {
        const User         = await getUserModel();
        const existingUser = await repository.getByEmail(data.email, User);
        if(!existingUser){
            return false;
        }
        
        const descrypt = descrypPassword(existingUser, data.password) ;
        const ret = descrypt.newHash === existingUser.password;
        if(!ret){
          return false;
        }

        return await generateToken({
            id:    existingUser._id,
            email: existingUser.email,
            name:  existingUser.name,
            roles: existingUser.roles
        });

    } catch (e) {
        return "Failed to process your request";
    }

};

exports.refreshToken = async(token) => {
    try {

        const User         = await getUserModel();
        const data         = await decodeToken(token);
        const user         = await repository.getById(data.id, User);

        if (!user) {
            return false;
        }

        return await generateToken({
            id:    user._id,
            email: user.email,
            name:  user.name,
            roles: user.roles
        });
    } catch (e) {
        return "Failed to process your request";
    }
};

exports.authorize = function (req, res, next) {
    
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({ message: 'Access Restrict'  });
    } else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                res.status(401).json({ message: 'Token Inválid' });
            } else {
                next();
            }
        });
    }
};

