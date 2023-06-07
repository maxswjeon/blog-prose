"use client";

import { useForm } from "react-hook-form";
import zxcvbn from "zxcvbn";

type Props = {
	pageKey?: string;
};

type FormValues = {
	name: string;
	username: string;
	password: string;
	passwordConfirm: string;
};

export default function Form({ pageKey }: Props) {
	const {
		register,
		handleSubmit,
		watch,
		setError,
		formState: { errors, isValid, isSubmitting },
	} = useForm<FormValues>({ mode: "onChange" });

	const onSubmit = handleSubmit(async ({ name, username, password }) => {
		const request = await fetch("/api/setup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ name, username, password, key: pageKey }),
		});

		if (request.ok) {
			window.location.href = "/admin";
			return;
		}

		const {
			error: { message },
		} = await request.json();

		setError("root", {
			type: "manual",
			message,
		});
	});

	return (
		<form onSubmit={onSubmit}>
			<div className="mb-3">
				<label
					htmlFor="name"
					className="block mb-1 text-sm font-medium text-gray-700"
				>
					Name<span className="text-red-500">*</span>
				</label>
				<input
					id="name"
					type="text"
					autoComplete="name"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					{...register("name", { required: "Name is required." })}
				/>
				{errors.username && (
					<p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
				)}
			</div>
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
					{...register("username", { required: "Username is required." })}
				/>
				{errors.username && (
					<p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
				)}
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
					autoComplete="new-password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					{...register("password", {
						required: true,
						validate: (value) =>
							zxcvbn(value).score >= 3 ||
							"Password is too weak. Try adding more words or characters",
					})}
				/>
				{errors.password && (
					<p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
				)}
			</div>
			<div className="mb-3">
				<label
					htmlFor="password-confirm"
					className="block mb-1 text-sm font-medium text-gray-700"
				>
					Password Confirm<span className="text-red-500">*</span>
				</label>
				<input
					id="password-confirm"
					type="password"
					autoComplete="new-password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					{...register("passwordConfirm", {
						required: true,
						validate: (value) =>
							value === watch("password") || "Passwords do not match",
					})}
				/>
				{errors.passwordConfirm && (
					<p className="mt-1 text-xs text-red-500">
						{errors.passwordConfirm.message}
					</p>
				)}
			</div>
			{errors.root && (
				<p className="mb-3 text-xs text-red-500">{errors.root.message}</p>
			)}
			<button
				type="submit"
				disabled={!isValid || isSubmitting}
				className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm"
			>
				Create Admin Account
			</button>
		</form>
	);
}
