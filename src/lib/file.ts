import fs from "fs/promises";
import path from "path";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import mime from "mime-types";

import { LocalDriverConfig, S3DriverConfig } from "types/config";

export async function readLocal(
  prefix: string,
  filename: string,
  config: LocalDriverConfig
) {
  return fs.readFile(
    path.resolve(process.cwd(), config.basePath, prefix, filename)
  );
}

export async function readS3(
  prefix: string,
  filename: string,
  config: S3DriverConfig
) {
  const client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    endpoint: config.endpoint || undefined,
  });

  const prefixString = prefix ? `${prefix}/` : "";

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: `${config.prefix}/${prefixString}${filename}`,
  });

  const result = await client.send(command);

  if (!result.Body) {
    throw new Error("Body was undefined");
  }

  return result.Body;
}

export async function uploadLocal(
  prefix: string,
  fileName: string,
  extension: string,
  image: ArrayBuffer,
  config: LocalDriverConfig
) {
  // path.resolve() will return the correct path if config.basePath is absolute path.
  const imageFolderPath = path.resolve(process.cwd(), config.basePath, prefix);
  const imageFilePath = path.join(imageFolderPath, `${fileName}.${extension}`);

  try {
    await fs.stat(imageFolderPath);
  } catch {
    await fs.mkdir(imageFolderPath, { recursive: true });
  }

  await fs.writeFile(imageFilePath, Buffer.from(image));
}

export async function uploadS3(
  prefix: string,
  fileName: string,
  extension: string,
  image: ArrayBuffer,
  config: S3DriverConfig
) {
  const client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    endpoint: config.endpoint || undefined,
  });

  const prefixString = prefix ? `${prefix}/` : "";

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: `${config.prefix}/${prefixString}${fileName}.${extension}`,
    Body: Buffer.from(image),
    ContentType: mime.lookup(extension) || "application/octet-stream",
  });

  await client.send(command);
}
