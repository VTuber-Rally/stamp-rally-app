import { cronJobs } from "convex/server";
import { internal } from "./_generated/api.js";

const crons = cronJobs();

// Run cards redistribution every hour. The cron checks for expired groups and
// redistributes their cards round-robin across future groups.
crons.interval("redistribute-cards", { hours: 1 }, internal.cards.redistribute);

export default crons;
