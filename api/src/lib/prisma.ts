import { PrismaClient } from "database";

export default new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});
