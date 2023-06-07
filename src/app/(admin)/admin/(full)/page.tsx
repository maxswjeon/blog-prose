import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "app/(admin)/Header";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.BASE_URL}/admin/login`);
  }

  const publishedPostCount = await prisma.post.count({
    where: {
      publishedAt: {
        not: null,
      },
    },
  });
  const draftPostCount = await prisma.post.count({
    where: {
      publishedAt: null,
    },
  });

  const userCount = await prisma.user.count();

  const config = await prisma.config.findFirst({
    orderBy: {
      id: "desc",
    },
    take: 1,
  });

  return (
    <main className="container mx-auto">
      <Header session={session} config={config} />
      <section className="mt-6 mx-6">
        <h2 className="text-2xl font-bold">Post Statistics</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <div className="relative p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3">Published Posts</h3>
            <p className="mt-3 text-4xl">{publishedPostCount}</p>
            <a
              href="/admin/users"
              className="absolute bottom-6 right-6 hover:underline"
            >
              Manage Posts
            </a>
          </div>
          <div className="relative p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3">Draft Posts</h3>
            <p className="mt-3 text-4xl">{draftPostCount}</p>
            <a
              href="/admin/drafts"
              className="absolute bottom-6 right-6 hover:underline"
            >
              Manage Drafts
            </a>
          </div>
        </div>
      </section>
      <section className="mt-6 mx-6">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <div className="relative p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3">Users</h3>
            <p className="mt-3 text-4xl">{userCount}</p>
            <a
              href="/admin/users"
              className="absolute bottom-6 right-6 hover:underline"
            >
              Manage Users
            </a>
          </div>
          <div className="relative p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3">Pages</h3>
            <p className="mt-3 text-4xl">{userCount}</p>
            <a
              href="/admin/users"
              className="absolute bottom-6 right-6 hover:underline"
            >
              Manage Pages
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
