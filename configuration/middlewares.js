import express                       from "express";
import consign                       from "consign";
import bodyParser                    from "body-parser";
import expressValidator              from "express-validator";
import morgan                        from "morgan";
import logger                        from "../logger/logger.js";

module.exports = () =>{
  var app = express();

  app.use(morgan("common", {
    stream: {
      write: function(mensagem){
          logger.info(mensagem);
      }
    }
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator());

  consign()
   .include('controllers')
   .then('persistencia')
   .into(app);

  return app;
}