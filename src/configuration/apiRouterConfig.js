"use strict";

import cors                         from "cors";
import indexRouter                  from "../routes/index-route";
import userRouter                   from "../routes/user-route";

export default function ConfigApiRoutes(app) {
    app.use(cors());
    app.use("/", indexRouter);
    app.use("/user", userRouter);
}