import mime from "mime-types";
import validator from "validator";

import { readLocal, readS3 } from "lib/file";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";
import { Config } from "types/config";

export async function GET(req: Request) {
  const filename = req.url.split("/").pop();

  if (!filename || !validator.isUUID(filename.split(".")[0])) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "The request has no ID.",
      },
    });
  }

  const mimeType = mime.contentType(filename);

  if (!mimeType) {
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "Couldn't find the appropreate mime type.",
      },
    });
  }

  const configString = await prisma.config.findFirst({
    orderBy: {
      id: "desc",
    },
    take: 1,
  });

  if (!configString) {
    try {
      const content = await readLocal("images", filename, {
        name: "local",
        basePath: "data",
      });
      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
        },
      });
    } catch (e) {
      console.log(e);
      return ResponseDTO.status(404).json({
        result: false,
        error: {
          title: "Not Found",
          message: "Couldn't find the image.",
        },
      });
    }
  }

  const config = JSON.parse(configString.config) as Config;
  if (config.image.driver.name === "local") {
    try {
      const content = await readLocal("images", filename, config.image.driver);
      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
        },
      });
    } catch (e) {
      console.log(e);
      return ResponseDTO.status(404).json({
        result: false,
        error: {
          title: "Not Found",
          message: "Couldn't find the image.",
        },
      });
    }
  } else if (config.image.driver.name === "s3") {
    try {
      const s3Body = await readS3("images", filename, config.image.driver);

      if (!s3Body) {
        return ResponseDTO.status(404).json({
          result: false,
          error: {
            title: "Not Found",
            message: "Couldn't find the image.",
          },
        });
      }

      const body = await s3Body.transformToByteArray();

      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
        },
      });
    } catch (e) {
      console.log(e);
      return ResponseDTO.status(404).json({
        result: false,
        error: {
          title: "Not Found",
          message: "Couldn't find the image.",
        },
      });
    }
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
