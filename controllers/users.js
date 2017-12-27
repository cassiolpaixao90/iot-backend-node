'use strict';

import {registrationSchema, loginSchema}        from "../validations/validationUserSchemas";
import colors                                   from "colors";
import crypto                                   from "crypto";

module.exports = app => {

    /**
   * @api {post} /users Cadastra novo usuário
   * @apiGroup Usuário
   * @apiParam {String} name Nome
   * @apiParam {String} email Email
   * @apiParam {String} password Senha
   * @apiParamExample {json} Entrada
   *    {
   *       "instalacao":"1221212132",
   *       "nome_cliente":"usuariotest",
   *       "email":"teste@lockmedown.com",
   *       "senha":"123456as"
   *    }
   * @apiSuccess {Number} id Id de registro
   * @apiSuccess {String} nome_cliente Nome do cliente
   * @apiSuccess {String} email Email
   * @apiSuccess {String} password Senha criptografada
   * @apiSuccess {Date} updated_at Data de atualização
   * @apiSuccess {Date} created_at Data de cadastro
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "instalacao":"1221212132",
   *      "nome_cliente": "John Connor",
   *      "email": "john@connor.net",
   *      "senha": "$2a$10$SK1B1",
   *      "salt" :  "ssasasashasjahsjas",
   *      "updated_at": "2015-09-24T15:46:51.778Z",
   *      "created_at": "2015-09-24T15:46:51.778Z"
   *    }
   * @apiErrorExample {json} Erro no cadastro
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post("/api/user/register", async(req, res) => {

    try {

      req.checkBody(registrationSchema);
      const errors = req.validationErrors();

      if (errors) {
        return res.status(500).json(errors);
      }

      const {instalacao, nome_cliente, email, senha} = req.body;
      let user = {

        instalacao  :   instalacao,
        nome_cliente:   nome_cliente,
        email       :   email,
        senha       :   senha,
        updated_at  :   undefined,
        created_at  :   undefined
      };

      const connection = app.persistence.connectionFactory();
      const userDao = new app.persistence.UserDao(connection);

      userDao.getByInstalacao( user.instalacao, (erro, resultado) =>{

        if (resultado.length > 0) {

          console.log(colors.red("já registrado"));
          return res.status(500).json({message: "User is existing"});

        } else {

          const salt      = Math.round((Date.now() * Math.random())) + '';
          console.log("salt", salt);

          const newHash   =  crypto.createHash('sha512')
                                   .update(salt + user.senha, 'utf8')
                                   .digest('hex');

          console.log("newHash", newHash);
          user.senha      = newHash;
          user.salt       = salt;
          user.updated_at = new Date();
          user.created_at = new Date();
          userDao.save(user, (erro, resultado) => {
            if (erro) {
              console.log(colors.red(erro));
              res.status(500).json({erro: erro});
            } else {
              user = {};
              console.log(colors.yellow(resultado));
              res.status(201).json({status: 201, message: "register success"});
              // usuario.id = resultado.insertId;
            }
         });
        }
      });

    } catch (error) {
      console.log(colors.red(error));
    }
  });


  app.post("/api/user/login", async(req, res) => {

    try {

      const {instalacao, senha} = req.body;
      let user = {
        instalacao  :   instalacao,
        senha       :   senha,
      };

      const connection = app.persistence.connectionFactory();
      const userDao = new app.persistence.UserDao(connection);

      userDao.getByInstalacao( user.instalacao, (erro, resultado) =>{

        if (resultado.length > 0) {
          const newHash   =  crypto.createHash('sha512')
                                   .update(resultado[0].salt + user.senha, 'utf8')
                                   .digest('hex');

          if( newHash === resultado[0].senha ){
            return res.status(201).json({ status:201, message: "logado com sucesso"});
          }
          else {
            return res.status(500).json({ status:501, message: "Instalação / senha inválidos! "});
          }
        }
      });

    } catch (error) {
      console.log(colors.red(error));
    }
  });

};
