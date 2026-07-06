import process from "node:process";
import { internal } from "~/_generated/api.js";

import { client } from "./utils/convexAdminClient.js";

if (process.argv.length !== 5) {
  console.error("Usage: createAdminUser.ts <username> <password> <email>");
  process.exit(1);
}

const [, , name, password, email] = process.argv;

await client.function(internal.auth.createUserWithEmailPassword, undefined, {
  role: "staff",
  name,
  password,
  email,
});
