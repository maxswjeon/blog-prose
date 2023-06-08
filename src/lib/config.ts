import { cache } from "react";

import { prisma } from "./prisma";

import { Config, defaultConfig } from "types/config";

export const getConfig = cache(async () => {
  const configRecord = await prisma.config.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  let config: Config = defaultConfig;
  if (configRecord) {
    config = JSON.parse(configRecord.config) as Config;
  }

  return config;
});
