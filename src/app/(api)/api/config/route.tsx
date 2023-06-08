import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";
import { getServerSession } from "next-auth";
import { Config } from "types/config";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return ResponseDTO.status(401).json({
      result: false,
      error: {
        title: "Unauthorized",
        message: "You must be signed in to perform this action.",
      },
    });
  }

  const config = (await req.json()) as Config;

  await prisma.config.create({
    data: {
      version: 1,
      config: JSON.stringify(config),
    },
  });

  return ResponseDTO.status(201).json({
    result: true,
  });
}
