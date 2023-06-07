import crypto from "crypto";

import mime from "mime-types";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { uploadLocal, uploadS3 } from "lib/file";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";
import { Config } from "types/config";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return ResponseDTO.status(401).json({
      result: false,
      error: {
        title: "Unauthorized",
        message: "You are not authorized.",
      },
    });
  }

  const contentType = req.headers.get("Content-Type");

  if (!contentType) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "The request type is unknown.",
      },
    });
  }

  if (!contentType?.startsWith("image/")) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "The request body is not a image.",
      },
    });
  }
  const uuid = crypto.randomUUID();
  const extension = mime.extension(contentType);

  if (!extension) {
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "Couldn't find the appropreate extension.",
      },
    });
  }

  const image = await req.arrayBuffer();

  const configString = await prisma.config.findFirst({
    orderBy: {
      id: "desc",
    },
    take: 1,
  });

  if (!configString) {
    await uploadLocal("images", uuid, extension, image, {
      name: "local",
      basePath: "data",
    });

    return ResponseDTO.status(200).json({
      result: true,
      data: {
        filename: `${uuid}.${extension}`,
      },
    });
  }

  const config = JSON.parse(configString.config) as Config;
  if (config.image.driver.name === "local") {
    await uploadLocal("images", uuid, extension, image, {
      name: "local",
      basePath: "data",
    });
  } else if (config.image.driver.name === "s3") {
    await uploadS3("images", uuid, extension, image, config.image.driver);
  } else {
    return ResponseDTO.status(501).json({
      result: false,
      error: {
        title: "Not Implemented",
        message: "The driver is not implemented.",
      },
    });
  }
}
