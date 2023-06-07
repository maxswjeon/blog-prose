export type FileDriver = LocalDriverConfig | S3DriverConfig;

export type LocalDriverConfig = {
  name: "local";
  basePath: string;
};

export type S3DriverConfig = {
  name: "s3";
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string | null;
  prefix: string;
};

export type Config = {
  metadata: {
    name: string;
    description: string;
  };
  image: {
    driver: FileDriver;
  };
  algolia?: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
  auth: {};
};

export const defaultConfig = {
  metadata: {
    name: "Prose CMS",
    description: "A simple CMS with great editing experience",
  },
  image: {
    driver: {
      name: "local",
      basePath: "data",
    },
  },
  algolia: {
    appId: "MN252XX0LM",
    apiKey: "3562f426024687a630f97a0053a37b55",
    indexName: "prose-cms",
  },
  auth: {},
} satisfies Config;
