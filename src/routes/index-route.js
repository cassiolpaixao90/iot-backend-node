'use strict';

import {Router}                           from "express";
import colors                             from "colors";
import controller                         from "../controllers/index-controller";

const indexRouter =  Router();

indexRouter.get('/', controller.get);

export default indexRouter;