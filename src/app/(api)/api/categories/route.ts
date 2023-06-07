import { Category } from "@prisma/client";
import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

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

  const newCategories = (await req.json()) as Category[];
  const categories = await prisma.category.findMany();

  try {
    const deletedCategories = categories.filter(
      (category) =>
        !newCategories.find((newCategory) => newCategory.id === category.id)
    );

    const addedCategories = newCategories.filter(
      (newCategory) =>
        !categories.find((category) => category.id === newCategory.id)
    );

    const updatedCategories = newCategories.filter((newCategory) =>
      categories.find((category) => category.id === newCategory.id)
    );

    const result = await Promise.allSettled([
      prisma.post.updateMany({
        where: {
          categoryId: {
            in: deletedCategories.map((category) => category.id),
          },
        },
        data: {
          categoryId: null,
        },
      }),

      prisma.category.deleteMany({
        where: {
          id: {
            in: [...deletedCategories.map((category) => category.id)],
          },
        },
      }),

      prisma.category.createMany({
        data: addedCategories,
      }),

      ...updatedCategories.map(async (category) => {
        await prisma.category.update({
          where: {
            id: category.id,
          },
          data: {
            ...category,
          },
        });
      }),
    ]);

    if (result.some((promise) => promise.status === "rejected")) {
      return ResponseDTO.status(500).json({
        result: false,
        error: {
          title: "Internal Server Error",
          message: "An error occurred while updating categories.",
        },
      });
    }

    return ResponseDTO.status(200).json({
      result: true,
    });
  } catch (e) {
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "An error occurred while updating categories.",
      },
    });
  }
}
