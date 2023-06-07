import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { prisma } from "lib/prisma";

import Form from "./Form";

type Props = {
	searchParams: {
		key: string;
	};
};

export default async function SetupPage({ searchParams: { key } }: Props) {
	const session = await getServerSession();

	if (session) {
		redirect("/admin");
	}

	const validKey = key && key === process.env.SETUP_KEY;

	const users = await prisma.user.count();
	if (users > 0 && !validKey) {
		redirect("/admin/login");
	}

	return (
		<main className="w-full max-w-sm m-3 mx-auto p-6 rounded-xl shadow-xl shrink-0">
			<h1 className="mb-6 text-2xl font-bold text-center">ProseCMS Setup</h1>
			<p className="mb-3 text-center">
				Welcome to ProseCMS!
				<br />
				Please enter username and password below for the first admin account.
			</p>
			<Form pageKey={key} />
		</main>
	);
}
