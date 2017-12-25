import {registrationSchema, loginSchema}        from "../validations/validationUserSchemas";
module.exports = app => {

    /**
   * @api {post} /users Cadastra novo usuário
   * @apiGroup Usuário
   * @apiParam {String} name Nome
   * @apiParam {String} email Email
   * @apiParam {String} password Senha
   * @apiParamExample {json} Entrada
   *    {
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "password": "123456"
   *    }
   * @apiSuccess {Number} id Id de registro
   * @apiSuccess {String} name Nome
   * @apiSuccess {String} email Email
   * @apiSuccess {String} password Senha criptografada
   * @apiSuccess {Date} updated_at Data de atualização
   * @apiSuccess {Date} created_at Data de cadastro
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "password": "$2a$10$SK1B1",
   *      "updated_at": "2015-09-24T15:46:51.778Z",
   *      "created_at": "2015-09-24T15:46:51.778Z"
   *    }
   * @apiErrorExample {json} Erro no cadastro
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post("/api/user/register", async(req, res) => {

    req.checkBody(registrationSchema);
    const errors = req.validationErrors();

    if (errors) {
        return res.status(500).json(errors);
    }

    const {email, password, name} = req.body;
    const user = {
      name:         name,
      email:        email,
      password:     password
    };


    const connection = app.persistencia.connectionFactory();
    let UsuarioDao = new app.persistencia.UsuarioDao(connection);
    pagamentoDao.salva(user, (erro, resultado) =>{
      if(erro){
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
        usuario.id = resultado.insertId;
        console.log('pagamento criado');
      }
    });
  });



};
  