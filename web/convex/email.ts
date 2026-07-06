import { BrevoClient } from "@getbrevo/brevo";

export const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });
