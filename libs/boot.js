import https                    from "https";
import fs                       from "fs";

module.exports = app => {
  if (process.env.NODE_ENV !== "test") {
      https.createServer(app)
            .listen(app.get("port"), () => {
                console.log(`IOT API - porta ${app.get("port")}`);
        });
  }
};
