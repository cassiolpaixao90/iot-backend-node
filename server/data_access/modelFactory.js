"use strict";

import { UserSchema }                           from "./schemas";
import connectionProvider                       from "./connectionProvider";
import { serverSettings }                       from "../settings";

export const getUserModel = async function () {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database);
        return conn.model("User", UserSchema);
    } catch (err) {
        throw err;
    }
};