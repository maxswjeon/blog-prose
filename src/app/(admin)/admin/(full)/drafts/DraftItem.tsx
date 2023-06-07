"use client";

import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  draft: Post;
};

export default function DraftItem({ draft }: Props) {
  const router = useRouter();

  return (
    <div
      className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 last-of-type:border-b-0"
      onClick={() => router.push(`/admin/drafts/edit/${draft.id}`)}
      onKeyDown={() => router.push(`/admin/drafts/edit/${draft.id}`)}
    >
      <p className="font-bold">{draft.title || "Untitled"}</p>
      <p className="text-sm text-gray-500">
        Created at{" "}
        {draft.createdAt.toLocaleString("en-US", { dateStyle: "long" })}
      </p>
    </div>
  );
}
