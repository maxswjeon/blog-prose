import { getServerSession } from "next-auth";

import argon2 from "argon2";

import { prisma } from "lib/prisma";
import ResponseDTO from "lib/response";

export async function POST(req: Request) {
	const session = await getServerSession();

	if (session) {
		return ResponseDTO.status(409).json({
			result: false,
			error: {
				title: "Conflict",
				message: "Setup should be ran without a session.",
			},
		});
	}

	const { name, username, password, key } = await req.json();

	if (!name || !username || !password) {
		return ResponseDTO.status(400).json({
			result: false,
			error: {
				title: "Bad Request",
				message: "Missing required parameters.",
			},
		});
	}

	const validKey = key && key === process.env.SETUP_KEY;

	if (!validKey) {
		const users = await prisma.user.count();

		if (users > 0) {
			return ResponseDTO.status(403).json({
				result: false,
				error: {
					title: "Forbidden",
					message: "Setup has already been ran.",
				},
			});
		}
	}

	const hash = await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 2 ** 16,
		timeCost: 4,
		parallelism: 2,
	});

	const user = await prisma.user.create({
		data: {
			name,
			username,
			password: hash,
		},
	});

	return ResponseDTO.status(201).json({
		result: true,
		data: {
			id: user.id,
		},
	});
}
