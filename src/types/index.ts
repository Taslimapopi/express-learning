export type Role = "admin" | "agent" | "user";

export const USER_ROLe = {
  admin: "admin",
  agent: "agent",
  user: "user",
} as const;
