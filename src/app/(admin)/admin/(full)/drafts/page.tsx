import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "app/(admin)/Header";
import Pagination from "components/Pagination";
import DraftItem from "./DraftItem";
import Providers from "./Providers";

import IconFolderOpen from "assets/icons/icon_folder-open.svg";
import IconPlus from "assets/icons/icon_plus.svg";

type Props = {
  searchParams?: {
    search?: string;
    page?: string;
  };
};

export default async function AdminDraftPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`${process.env.BASE_URL}/admin/login`);
  }

  const config = await prisma.config.findFirst({
    orderBy: {
      id: "desc",
    },
    take: 1,
  });

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const search = searchParams?.search ? searchParams.search : "";
  const skip = (page - 1) * 10 ?? 0;

  const drafts = await prisma.post.findMany({
    where: {
      publishedAt: null,
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    skip,
    take: 10,
  });

  const draftCount = await prisma.post.count({
    where: {
      publishedAt: null,
    },
  });

  return (
    <main className="container mx-auto">
      <Header session={session} config={config} />
      <section className="mt-6 mx-6">
        <div className="flex">
          <h2 className="text-2xl font-bold shrink-0">Draft Posts</h2>
          <div className="flex-1" />
          <a
            href="/admin/drafts/new"
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
          >
            <IconPlus className="w-5 h-5 fill-gray-800" />
          </a>
        </div>
        <div className="mt-3">
          <div>
            {drafts.map((draft) => (
              <DraftItem draft={draft} key={draft.id} />
            ))}
          </div>
          {drafts.length === 0 && (
            <div className="w-full flex flex-col justify-center items-center">
              <IconFolderOpen className="w-24 h-24 mt-6 fill-gray-300" />
              <p className="mt-3 text-gray-500">No drafts yet</p>
            </div>
          )}
          {drafts.length !== 0 && (
            <div className="mt-6 flex justify-center">
              <Providers>
                <Pagination total={draftCount} />
              </Providers>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
