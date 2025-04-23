import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

import * as schema from "./schema";

// You can specify any property from the mysql2 connection options
export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: "snake_case",
  schema,
  mode: "default",
});
