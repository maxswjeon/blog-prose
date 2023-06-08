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
};

export const defaultConfig = {
  metadata: {
    name: "Blog",
    description: "A blog",
  },
  image: {
    driver: {
      name: "local",
      basePath: "data",
    },
  },
} satisfies Config;
