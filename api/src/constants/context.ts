import type { User } from "database";

export type Variables = {
  user: Omit<User, "password">;
};
