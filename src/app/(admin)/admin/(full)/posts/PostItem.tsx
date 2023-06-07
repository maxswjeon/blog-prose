"use client";

import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  post: Post;
};

export default function PostItem({ post }: Props) {
  const router = useRouter();

  return (
    <div
      className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 last-of-type:border-b-0"
      onClick={() => router.push(`/admin/drafts/edit/${post.id}`)}
      onKeyDown={() => router.push(`/admin/drafts/edit/${post.id}`)}
    >
      <p className="font-bold">{post.title || "Untitled"}</p>
      <p className="text-sm text-gray-500">
        {/* post.publishedAt will never be null */}
        Published At{" "}
        {post.publishedAt?.toLocaleString("en-US", { dateStyle: "long" }) || ""}
      </p>
    </div>
  );
}
