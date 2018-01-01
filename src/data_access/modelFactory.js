"use strict";

import { UserSchema }                           from "../models/user";
import connectionProvider                       from "./connectionProvider";
import { serverSettings }                       from "../settings/setting.dev";

export const getUserModel = async  () => {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database);
        return conn.model("User", UserSchema);
    } catch (err) {
        throw err;
    }
};