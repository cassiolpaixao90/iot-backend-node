import express                  from "express";
import consign                  from "consign";

const app = express();

consign({verbose: false})
  .include("libs/middlewares.js")
  .then("persistencia")
  .then("controllers")
  .then("libs/boot.js")
  .into(app);

module.exports = app;