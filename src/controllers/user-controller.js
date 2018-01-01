'use strict';

import {registrationSchema, loginSchema}        from "../validators/validationSchemas";
import userService                              from "../services/user-service";

exports.post = async(req, res, next) => {

    try {

        req.checkBody(registrationSchema);
        const errors = req.validationErrors();
        if (errors) {
            return res.status(500).json(errors);
        }
        const {email, password, name} = req.body;
        const data = {
            name       :  name,
            email      :  email,
            password   :  password,
            roles      :  ["user"]
        };

        const existingUser = await userService.save(data);
        if(existingUser){
            return res.status(409).json({ message: 'msg:`The specified email ${email} address already exists.`'});
        }
        res.status(201).send({ message: 'registered successfully!' });

    } catch (e) {
        res.status(500).send({ message: 'Failed to process your request' });
    }
};

exports.authenticate = async(req, res, next) => {
    try {
        req.checkBody(loginSchema);
        const errors = req.validationErrors();
        if (errors) {
            return res.status(500).json(errors);
        }

        const { email, password } = req.body;
        const data = {
            email: email,
            password: password
        };

        const user = await userService.authenticate(data);
        if(!user){
            return res.status(404).send({message: 'Usuário ou senha inválidos'});
        }

        res.status(201).send({
            token: user
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.refreshToken = async(req, res, next) => {
    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await userService.refreshToken(token);
        if (!dat) {
            return res.status(404).send({ message: 'Not found!'  });
        }
        res.status(201).send({ token: data });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' });
    }
};
