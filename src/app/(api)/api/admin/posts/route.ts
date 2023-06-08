import { getServerSession } from "next-auth";

import authOptions from "lib/auth";
import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

export async function GET(req: Request) {
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
	const id = url.searchParams.get("id");

	if (!id) {
		return ResponseDTO.status(400).json({
			result: false,
			error: {
				title: "Bad Request",
				message: "The request query is unknown.",
			},
		});
	}

	const post = await prisma.post.findUnique({
		where: {
			id,
		},
	});

	if (!post) {
		return ResponseDTO.status(404).json({
			result: false,
			error: {
				title: "Not Found",
				message: "The post is not found.",
			},
		});
	}

	return ResponseDTO.status(200).json({
		result: true,
		data: post,
	});
}

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

	const { id, title, description, content } = await req.json();

	if (
		!id ||
		typeof title !== "string" ||
		typeof description !== "string" ||
		typeof content !== "string"
	) {
		return ResponseDTO.status(400).json({
			result: false,
			error: {
				title: "Bad Request",
				message: "The request query is unknown.",
			},
		});
	}

	const post = await prisma.post.findUnique({
		where: {
			id,
		},
	});

	if (!post) {
		return ResponseDTO.status(404).json({
			result: false,
			error: {
				title: "Not Found",
				message: "The post is not found.",
			},
		});
	}

	const updatedPost = await prisma.post.update({
		where: {
			id,
		},
		data: {
			title,
			description,
			content,
		},
	});

	return ResponseDTO.status(200).json({
		result: true,
		data: updatedPost,
	});
}
