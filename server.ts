import "reflect-metadata";

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";

import { User } from "./src/entities/User";
import router from "./src/routes";
import ENV from "./src/config";

(async () => {
  const httpsOptions = {
    key: fs.readFileSync("sslcert/key.pem"),
    cert: fs.readFileSync("sslcert/cert.pem"),
  };

  const conn = await createConnection({
    type: "postgres",
    url: ENV.DB_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User],
  });

  await conn.runMigrations();

  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/", router);

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(httpsOptions, app);

  httpServer.listen(ENV.HTTP_PORT, () =>
    console.log(
      `🚀 HTTP server is running in ${ENV.NODE_ENV} on port ${ENV.HTTP_PORT}`
    )
  );
  httpsServer.listen(ENV.HTTPS_PORT, () =>
    console.log(
      `🚀 HTTPS server is running in ${ENV.NODE_ENV} on port ${ENV.HTTPS_PORT}`
    )
  );
})().catch((err) => console.error(err));
