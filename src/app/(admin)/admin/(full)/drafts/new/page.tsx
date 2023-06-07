import crypto from "crypto";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";

export default async function AdminDraftPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`${process.env.BASE_URL}/admin/login`);
  }

  const uuid = crypto.randomUUID();

  await prisma.post.create({
    data: {
      id: uuid,
      title: "",
      description: "",
      content: "[]",
      author: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  redirect(`${process.env.BASE_URL}/admin/drafts/edit/${uuid}`);
}
