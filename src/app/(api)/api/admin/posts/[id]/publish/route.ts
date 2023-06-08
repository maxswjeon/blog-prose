import { getServerSession } from "next-auth";
import validator from "validator";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return ResponseDTO.status(401).json({
			result: false,
			error: {
				title: "Unauthorized",
				message: "You are not authorized.",
			},
		});
	}

	const url = new URL(req.url);

	const pathParts = url.pathname.split("/");
	pathParts.pop(); // remove "publish"
	const id = pathParts.pop(); // get the id

	const { slug } = await req.json();

	if (!id || !validator.isUUID(id)) {
		return ResponseDTO.status(400).json({
			result: false,
			error: {
				title: "Invalid request",
				message: "Missing post id",
			},
		});
	}

	try {
		await prisma.post.update({
			where: {
				id,
			},
			data: {
				publishedAt: new Date(),
				slug,
			},
		});

		return ResponseDTO.status(200).json({
			result: true,
		});
	} catch (error) {
		console.log(error);
		return ResponseDTO.status(500).json({
			result: false,
			error: {
				title: "Internal Server Error",
				message: "Something went wrong.",
			},
		});
	}
}
