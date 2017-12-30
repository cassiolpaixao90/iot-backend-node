// import express                  from "express";
// import consign                  from "consign";

// const app = express();

// consign({verbose: false})
//   .include("libs/middlewares.js")
//   .then("libs/boot.js")
//   .then("controllers")
//   .then("persistencia")
//   .into(app);

// module.exports = app;

const app             = require("./configuration//middlewares")();
const http            = require("http").Server(app);
const io              = require('socket.io')(http);

app.set("io", io);
require("./configuration/socketio")(app);

http.listen(7000, function(){
  console.log('Servidor rodando na porta 7000.');
});
