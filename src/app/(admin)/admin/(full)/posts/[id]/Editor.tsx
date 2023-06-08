"use client";

import { useContext } from "react";

import { useRouter } from "next/navigation";

import { Post } from "@prisma/client";
import axios from "axios";

import { default as BaseEditor } from "components/editor";
import { SheetContext } from "./Providers";

import IconChevronLeft from "assets/icons/icon_chevron-left.svg";

type Props = {
  post: Post;
};

export default function Editor({ post }: Props) {
  const router = useRouter();

  const { openPublishSheet } = useContext(SheetContext);

  const unpublish = async () => {
    await axios.post(`/api/admin/posts/${post.id}/unpublish`, null, {
      withCredentials: true,
    });

    router.push("/admin/drafts");
  };

  return (
    <>
      <div className="w-full flex p-3 border-b border-gray-100">
        <a href="/admin/posts" className="flex items-center">
          <IconChevronLeft className="w-5 h-5 mr-2" />
          <p>Return to post list</p>
        </a>
        <div className="flex-1" />
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          onClick={async () => {
            await unpublish();
          }}
        >
          Unpublish
        </button>
        <div className="w-3 h-3" />
        <button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
          onClick={async () => {
            openPublishSheet();
          }}
        >
          Edit
        </button>
      </div>
      <BaseEditor
        title={post.title}
        setTitle={() => {}}
        description={post.description}
        setDescription={() => {}}
        content={post.content}
        setContent={() => {}}
        save={() => {}}
        disabled={true}
      />
    </>
  );
}
