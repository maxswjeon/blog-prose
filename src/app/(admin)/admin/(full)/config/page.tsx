import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { getConfig } from "lib/config";

import Header from "app/(admin)/Header";
import Form from "./Form";

export default async function AdminConfigPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`${process.env.BASE_URL}/admin/login`);
  }

  const config = await getConfig();

  return (
    <main className="container mx-auto">
      <Header session={session} config={config} />
      <Form config={config} />
    </main>
  );
}
