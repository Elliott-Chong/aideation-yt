import { Clerk } from "@clerk/backend";

export const clerk = Clerk({
  apiKey: process.env.CLERK_SECRET_KEY,
});
