import { query } from "./_generated/server.js";
import { getStaffLoggedInUser } from "./users.js";

export const getPrizes = query({
  args: {},
  handler: async (ctx) => {
    await getStaffLoggedInUser(ctx);
    return ctx.db.query("prizes").collect();
  },
});
