'use strict';

import {Router}                           from "express";
import colors                             from "colors";
import controller                         from "../controllers/user-controller";
import userService                        from "../services/user-service";

const userRouter =  Router();

userRouter.post('/', controller.post);
userRouter.post('/authenticate', controller.authenticate);
userRouter.post('/refresh-token', userService.authorize, controller.refreshToken);

export default userRouter;