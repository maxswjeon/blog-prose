import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import Form from "./Form";

export default async function AdminLoginPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/admin");
	}

	const users = await prisma.user.count();
	if (users === 0) {
		redirect("/admin/setup");
	}

	return (
		<main className="w-full max-w-sm m-3 mx-auto p-6 rounded-xl shadow-xl shrink-0">
			<h1 className="mb-6 text-2xl font-bold text-center">ProseCMS Login</h1>
			<Form />
		</main>
	);
}
