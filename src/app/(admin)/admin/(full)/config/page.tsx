import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "app/(admin)/Header";

export default async function AdminConfigPage() {
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

  return (
    <main className="container mx-auto">
      <Header session={session} config={config} />
    </main>
  );
}
