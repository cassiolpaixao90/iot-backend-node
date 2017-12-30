const http             = require("./configuration//middlewares")();

http.listen(7000, function(){
  console.log('Servidor rodando na porta 7000.');
});
