"use strict";
/* eslint-disable no-console */

import express, {Router}            from "express";
import bodyParser                   from "body-parser";
import expressValidator             from "express-validator";
import apiRouteConfig               from "./configuration/apiRouterConfig";
import { serverSettings }           from "./settings/setting.dev";
import mongoose                     from "mongoose";
import morgan                       from "morgan";
import logger                       from "./logger/logger";
import pushService                  from "./services/push-service";
// import pushService                  from "./services/test-service";

const app             = express();
const http            = require("http").Server(app);
const io              = require('socket.io')(http);
// Connecta ao banco
// mongoose.connect("mongodb://iot-sensor:iot2018@ds135747.mlab.com:35747/iot-sensor");
// require('./models/user');


// require('./data_access/connectionProvider')('mongodb://iot-sensor:iot2018@ds135747.mlab.com:35747/iot-sensor');
app.set("io", io);
app.use(morgan("common", {
    stream: {
      write: function(mensagem){
          logger.info(mensagem);
      }
    }
}));

app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    extended: false
}));


//configuracao para validacao dos campos
app.use(expressValidator());

//configuracao de rotas
apiRouteConfig(app);

// Habilita o CORS
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     next();
// });
io.on('connection', function(socket) {
    socket.on('register', function (userId, connectionId) {
        pushService.registerSocket(userId, connectionId, socket);
    });

    socket.on('disconnect', function () {
        pushService.removeConnection(socket);
    });
});

export default http;