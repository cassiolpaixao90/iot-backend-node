import {serverSettings}             from "../settings";

export const secret = {
    "secret": process.env.NODE_ENV === 'production' ? process.env.SECRET : serverSettings.session.secret
};