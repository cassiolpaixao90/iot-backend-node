import winston          from "winston";
import fs               from "fs";

if(!fs.existsSync('logs')){
  fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "logs/api-iot.log",
      maxsize: 100000,
      maxFiles: 10
    })
  ]
});
