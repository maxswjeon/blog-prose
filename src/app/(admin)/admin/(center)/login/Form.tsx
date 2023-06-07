"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function Form() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		return signIn("credentials", {
			username,
			password,
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<div className="mb-3">
				<label
					htmlFor="username"
					className="block mb-1 text-sm font-medium text-gray-700"
				>
					Username<span className="text-red-500">*</span>
				</label>
				<input
					id="username"
					type="text"
					autoComplete="username"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					required
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div className="mb-3">
				<label
					htmlFor="password"
					className="block mb-1 text-sm font-medium text-gray-700"
				>
					Password<span className="text-red-500">*</span>
				</label>
				<input
					id="password"
					type="password"
					autoComplete="current-password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					name="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button
				type="submit"
				className="w-full px-3 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Login
			</button>
		</form>
	);
}
