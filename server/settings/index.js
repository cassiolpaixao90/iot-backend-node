"use strict";

export const serverSettings = {
    serverUrl: "localhost:27017",
    database: "iot-sensor",
    cache: {
        password: "bfdf8aba8e784557af145db15f8703c1"
    },
    session: {
        secret: "1652f8dfa00443589e12afb7ec37f2c5"
    }
};

export const secret = {
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : "secret"
};