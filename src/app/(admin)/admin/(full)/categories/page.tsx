import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { getConfig } from "lib/config";
import { prisma } from "lib/prisma";

import { Category } from "@prisma/client";
import Header from "app/(admin)/Header";
import ClientContent from "./ClientContent";
import Providers from "./Providers";

export type CategoryItem = Category & {
  _count: {
    posts: number;
  };
};

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`${process.env.BASE_URL}/admin/login`);
  }

  const config = await getConfig();

  const defaultCategoryPosts = await prisma.post.count({
    where: {
      category: null,
    },
  });

  const defaultCategory = {
    id: "default",
    name: "Default",
    description: "Default category",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    parentId: null,
    _count: {
      posts: defaultCategoryPosts,
    },
  } satisfies CategoryItem;

  const categories = [
    defaultCategory,
    ...(await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })),
  ];

  return (
    <main className="container mx-auto">
      <Header session={session} config={config} />
      <section className="mt-6 mx-6">
        <Providers>
          <ClientContent categories={categories} />
        </Providers>
      </section>
    </main>
  );
}
