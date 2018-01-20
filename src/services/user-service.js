import {getUserModel}       from "../data_access/modelFactory";
import repository           from "../repositories/user-repository";
import jwt                  from "jsonwebtoken";
import crypto               from 'crypto';
import IotError             from '../exception/iot-exception';

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
            throw new IotError(`The specified email ${data.email} address already exists.`, 409);
        }

        const newPassword = cryptoPassword(data.password);
        data.password = newPassword.newHash;
        data.salt = newPassword.salt;
        await repository.create(data, User);
    }
    catch(e){
        throw new IotError(e.message, e.status);
    }
};

exports.authenticate =  async (data) => {

    try {
        const User         = await getUserModel();
        const existingUser = await repository.getByEmail(data.email, User);
        if(!existingUser){
            throw new IotError(`Usuario ${data.email} não cadastrado!`, 409);
        }
        
        const descrypt = descrypPassword(existingUser, data.password) ;
        const ret = descrypt.newHash === existingUser.password;
        if(!ret){
          throw new IotError("Usuário ou senha inválidos",404);
        }

        return await generateToken({
            id:    existingUser._id,
            email: existingUser.email,
            name:  existingUser.name,
            roles: existingUser.roles
        });

    } catch (e) {
        throw new IotError(e.message, e.status);
    }

};

exports.refreshToken = async(token) => {
    try {

        const User         = await getUserModel();
        const data         = await decodeToken(token);
        const user         = await repository.getById(data.id, User);

        if (!user) {
            throw new IotError("Token não encontrado!", 404);
        }

        return await generateToken({
            id:    user._id,
            email: user.email,
            name:  user.name,
            roles: user.roles
        });
    } catch (e) {
        throw new IotError(e.message, e.status);
    }
};

exports.authorize = function (req, res, next) {
    
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({ message: 'Acesso não permitido!'});
    } else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                res.status(401).json({ message: 'Token invalido!' });
            } else {
                next();
            }
        });
    }
};

