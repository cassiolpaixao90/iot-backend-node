"use strict";

import cors                         from "cors";
import authenticationRouter         from "../routes/authenticationRoutes"

export default function ConfigApiRoutes(app) {
    app.use(cors());
    app.use(authenticationRouter);
}