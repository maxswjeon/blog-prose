import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { getConfig } from "lib/config";
import { prisma } from "lib/prisma";
import { Config, defaultConfig } from "types/config";
import Form from "./Form";

export default async function AdminLoginPage() {
  console.log("getServerSession Before");
  const session = await getServerSession(authOptions);
  console.log("getServerSession After");

  if (session) {
    redirect("/admin");
  }

  const noUser = !process.env.USER_ID || !process.env.USER_PASSWORD;

  console.log("getConfig Before");
  const config = await getConfig();
  console.log("getConfig After");

  return (
    <main className="w-full max-w-sm m-3 mx-auto p-6 rounded-xl shadow-xl shrink-0">
      <h1 className="mb-6 text-2xl font-bold text-center">
        Login to {config.metadata.name}
      </h1>
      {noUser ? (
        <p className="mt-3 text-red-500 text-center">
          No user configured! Please add a user by setting USER_ID and
          USER_PASSWORD environment variable
        </p>
      ) : (
        <Form />
      )}
    </main>
  );
}

export async function generateMetadata() {
  const configRecord = await prisma.config.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const config = configRecord
    ? (JSON.parse(configRecord.config) as Config)
    : defaultConfig;

  return {
    title: `Login to ${config.metadata.name}`,
  };
}
