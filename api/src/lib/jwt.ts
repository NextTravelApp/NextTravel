import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

export async function signToken(userId: string) {
  return await sign(
    {
      user: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    process.env.JWT_SECRET as string,
  );
}

export async function verifyToken(token: string) {
  try {
    return (await verify(token, process.env.JWT_SECRET as string)) as {
      user: string;
    } & JWTPayload;
  } catch (_) {
    return null;
  }
}
