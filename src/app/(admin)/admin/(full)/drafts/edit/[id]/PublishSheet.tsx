"use client";

import { useState } from "react";

import { Post } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type Props = {
	post: Post;
	isOpen: boolean;
	onClose: () => void;
};

export default function PublishSheet({ post, isOpen, onClose }: Props) {
	const router = useRouter();

	const [slug, setSlug] = useState(post.slug || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) {
		return null;
	}

	const publish = async () => {
		try {
			setLoading(true);

			await axios.post(`/api/admin/posts/${post.id}/publish`, {
				withCredentials: true,
				data: { slug },
			});

			router.push("/admin/posts");
		} catch (error) {
			console.error(error);

			if (error instanceof AxiosError) {
				setError(error.response?.data.error.message || "Something went wrong");
				return;
			}
			setError("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="z-10 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen cursor-default"
			onClick={(e) => {
				e.stopPropagation();
				onClose();
			}}
			onKeyDown={(e) => {
				e.stopPropagation();
				onClose();
			}}
		>
			<div
				className="absolute top-1/2 h-[50vh] right-0 w-full md:h-screen md:top-0 md:w-1/2 xl:w-1/3 overflow-y-auto bg-white z-20 p-6 flex flex-col pointer-events-auto"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<h2 className="text-2xl font-bold">Publish Post</h2>
				<div className="mt-3">
					<label
						htmlFor="slug"
						className="block text-sm font-medium text-gray-700"
					>
						Slug<span className="text-red-500">*</span>
					</label>
					<input
						id="slug"
						type="text"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					/>
				</div>
				{error && <p className="mt-3 text-sm text-red-500">{error}</p>}
				<div className="flex-1" />
				<div className="flex justify-end">
					<button
						type="button"
						className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md disabled:opacity-50"
						onClick={onClose}
						disabled={loading}
					>
						Cancel
					</button>
					<div className="w-3 h-3" />
					<button
						type="button"
						className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md disabled:opacity-50"
						onClick={publish}
						disabled={loading || !slug}
					>
						Publish
					</button>
				</div>
			</div>
		</div>
	);
}
