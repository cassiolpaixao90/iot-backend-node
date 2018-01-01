'use strict';

import {Router}                           from "express";
import colors                             from "colors";
import controller                         from "../controllers/index-controller";

const indexRouter =  Router();

indexRouter.get('/', controller.get);
indexRouter.get('/api/status/ping', controller.ping);
indexRouter.get('/api/status/info', controller.status);

export default indexRouter;