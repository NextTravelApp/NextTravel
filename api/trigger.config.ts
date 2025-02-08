import { InfisicalSDK } from "@infisical/sdk";
import { syncEnvVars } from "@trigger.dev/build/extensions/core";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_wqdkkhfxboftswnyhovk",
  runtime: "node",
  logLevel: "log",
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    extensions: [
      prismaExtension({
        schema: "../database/prisma/schema.prisma",
      }),

      syncEnvVars(async (ctx) => {
        const client = new InfisicalSDK({
          siteUrl: "https://eu.infisical.com",
        });

        await client.auth().universalAuth.login({
          clientId: process.env.INFISICAL_CLIENT_ID as string,
          clientSecret: process.env.INFISICAL_CLIENT_SECRET as string,
        });

        const { secrets } = await client.secrets().listSecrets({
          environment: ctx.environment,
          projectId: process.env.INFISICAL_PROJECT_ID as string,
          tagSlugs: ["backend"],
        });

        return secrets.map((secret) => ({
          name: secret.secretKey,
          value: secret.secretValue,
        }));
      }),
    ],
  },
  dirs: ["./src/trigger"],
  maxDuration: 5 * 60,
});
