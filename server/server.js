"use strict";
/* eslint-disable no-console */

import express, {Router}            from "express";
import bodyParser                   from "body-parser";
import apiRouteConfig               from "./configurations/apiRouterConfig";
import sessionManagementConfig      from "./configurations/sessionsManagementConfig";
import expressValidator             from "express-validator";

const host      = "localhost";
const port      = 3000;
const app       = express();

sessionManagementConfig(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.json());

apiRouteConfig(app);
require('./configurations/passportConfig');
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`O servidor foi iniciado  http://${host}:${port}`);
    }
});



