import { PrismaClient } from "database";

export default new PrismaClient({
  omit: {
    user: {
      password: true,
      notificationTokens: true,
      resetCode: true,
    },
    searchRequest: {
      tokens: true,
    },
    chatMessage: {
      tokens: true,
    },
  },
});
