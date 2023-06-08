import { prisma } from "lib/prisma";

import IconCalendar from "assets/icons/icon_calendar.svg";

export default async function MainPage() {
  const posts = await prisma.post.findMany({
    where: {
      publishedAt: {
        not: null,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <section className="">
      {posts.map((post) => (
        <a
          href={`/posts/${post.slug}`}
          className="block m-6 p-6 rounded-lg border border-gray-300"
        >
          <p className="text-2xl">{post.title}</p>
          <p className="mt-3 text-gray-400">{post.description}</p>
          <div className="flex mt-3">
            <div className="flex items-center">
              <IconCalendar className="w-3 h-3 fill-gray-400 mr-2" />
              <p className="text-sm text-gray-400">
                {post.createdAt.toLocaleDateString("en-US", {
                  dateStyle: "long",
                })}
              </p>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
