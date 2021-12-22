import path from "path";
import { createConnection } from "typeorm";
import { DATABASE_URL, NODE_ENV } from ".";

import { User } from "../entities/User";

export const connectDB = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: DATABASE_URL,
    logging: true,
    synchronize: true,
    ssl: NODE_ENV !== "development",
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User],
  });

  await conn.runMigrations();
};
