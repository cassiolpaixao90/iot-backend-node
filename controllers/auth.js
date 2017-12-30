import crypto                                   from 'crypto';
import jwt                                      from "jsonwebtoken";
module.exports = app => {
    /**
     * @api {get} / API Status
     * @apiGroup Status
     * @apiSuccess {String} status Mensagem de status da API
     * @apiSuccessExample {json} Sucesso
     *    HTTP/1.1 200 OK
     *    {
     *      "status": "IoT API"
     *    }
     */
 
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
  
  
          console.log("resultado", resultado);
          if (resultado.length > 0) {
            const newHash   =  crypto.createHash('sha512')
                                     .update(resultado[0].salt + user.senha, 'utf8')
                                     .digest('hex');
            if( newHash === resultado[0].senha ){

              const today = new Date();
              const exp = new Date(today);
              exp.setDate(today.getDate() + 60);

              const token = jwt.sign({
                id: resultado[0].id,
                instalacao: resultado[0].instalacao,
                nome: resultado[0].nome_cliente,
              }, app.get('secret'), {
                  expiresIn: parseInt(exp.getTime() / 1000)
              });

              console.log('Autenticado: token adicionado na resposta', token);
              res.json(token);
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
  
  
    app.use("/*", (req, res, next) =>{
      
      try {
        let authorizationHeader = req.headers.authorization;
	      let token = authorizationHeader ? authorizationHeader.split(/(\s+)/)[2] : '';
       
        if (token) {
          console.log('Token recebido, decodificando');
          jwt.verify(token, app.get('secret'), (err, decoded) =>{
            if (err) {
              console.log('Token rejeitado');
              return res.sendStatus(401);
            } else {
              console.log('Token aceito')
              req.usuario = decoded;
              next();
            }
          });
        } else {
          console.log('Nenhum token enviado');
          return res.sendStatus(401);
        }
      } catch (error) {
          console.log(error);
          return res.sendStatus(401).json({error:error});
      }
     
    });

  };
