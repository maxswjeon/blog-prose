import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "app/(admin)/Header";
import Editor from "./Editor";
import Providers from "./Providers";

type Props = {
  params: {
    id: string;
  };
};

// FIXME: The side menu (drag handle) shows even when the publishSheet is open
//        Will be fixed with https://github.com/TypeCellOS/BlockNote/issues/230

export default async function AdminDraftPage({ params: { id } }: Props) {
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

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    redirect(`${process.env.BASE_URL}/admin/drafts`);
  }

  return (
    <Providers post={post}>
      <main className="relative z-0 container mx-auto flex flex-col">
        <Header session={session} config={config} />
        <Editor post={post} />
      </main>
    </Providers>
  );
}
