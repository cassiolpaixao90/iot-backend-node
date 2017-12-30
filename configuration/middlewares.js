import express                       from "express";
import consign                       from "consign";
import bodyParser                    from "body-parser";
import expressValidator              from "express-validator";
import morgan                        from "morgan";
import logger                        from "../logger/logger.js";

module.exports = () =>{
  let app         = express();
  const http      = require("http").Server(app);
  const io        = require('socket.io')(http);

  app.use(morgan("common", {
    stream: {
      write: function(mensagem){
          logger.info(mensagem);
      }
    }
  }));

  app.set("io", io);
  app.set('secret', 'éobixao');
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());

  require("./socketio")(app);

  consign()
    .include('controllers/auth.js')
    .then('controllers')
    .then('persistence')
    .into(app);

  return http;
}
