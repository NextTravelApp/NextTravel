import { createClient } from "@1password/sdk";
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

      syncEnvVars(async () => {
        const client = await createClient({
          auth: process.env.OP_SERVICE_ACCOUNT_TOKEN as string,
          integrationName: "NextTravel Trigger",
          integrationVersion: "v1.0.0",
        });

        const item = await client.items.get(
          process.env.OP_VAULT_ID as string,
          process.env.OP_ITEM_ID as string,
        );
        const secrets = item.fields.map((item) => ({
          name: item.title,
          value: item.value,
        }));

        return secrets;
      }),
    ],
  },
  dirs: ["./src/trigger"],
  maxDuration: 5 * 60,
});
