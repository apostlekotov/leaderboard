import path from "path";
import { createConnection } from "typeorm";
import { DATABASE_URL } from ".";

import { User } from "../entities/User";

export const connectDB = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: DATABASE_URL,
    logging: false,
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User],
  });

  await conn.runMigrations();
};