'use strict';

import {Router}                           from "express";
import colors                             from "colors";
import controller                         from "../controllers/push-controller";
import pushService                        from "../services/push-service";

const pushRouter =  Router();

pushRouter.put('/api/:userId/register', controller.registerUser);
pushRouter.post('/api/:userId/push',    controller.pushMessage);

export default pushRouter;
