"use strict";
/* eslint-disable no-console */

import express, {Router}            from "express";
import bodyParser                   from "body-parser";
import apiRouteConfig               from "./configurations/apiRouterConfig";

const host      = "localhost";
const port      = 3000;
const app       = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
apiRouteConfig(app);

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`O servidor foi iniciado  http://${host}:${port}`);
    }
});



