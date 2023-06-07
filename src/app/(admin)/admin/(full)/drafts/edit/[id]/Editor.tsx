"use client";

import { useContext, useEffect, useState } from "react";

import { Post } from "@prisma/client";
import axios from "axios";

import { default as BaseEditor } from "components/editor";
import { SheetContext } from "./Providers";

import IconChevronLeft from "assets/icons/icon_chevron-left.svg";

type Props = {
  post: Post;
};

export default function Editor({ post }: Props) {
  const { openPublishSheet, publishSheetOpen } = useContext(SheetContext);

  const [title, setTitle] = useState<string>(post.title);
  const [description, setDescription] = useState<string>(post.description);
  const [content, setContent] = useState<string>(post.content);

  const savePost = async () => {
    await axios.post("/api/admin/posts", {
      id: post.id,
      title,
      description,
      content,
    });
  };

  // Save post data
  useEffect(() => {
    const timeout = setTimeout(() => {
      savePost();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [title, description, content]);

  // Update Page title
  useEffect(() => {
    document.title = `${title || "Untitled"} - ProseCMS`;
  }, [title]);

  return (
    <>
      <div className="w-full flex p-3 border-b border-gray-100">
        <a href="/admin/drafts" className="flex items-center">
          <IconChevronLeft className="w-5 h-5 mr-2" />
          <p>Return to draft list</p>
        </a>
        <div className="flex-1" />
        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
          onClick={savePost}
        >
          Save
        </button>
        <div className="w-3 h-3" />
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
          onClick={async () => {
            await savePost();
            openPublishSheet();
          }}
        >
          Publish
        </button>
      </div>
      <BaseEditor
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        content={content}
        setContent={setContent}
        save={savePost}
        disabled={publishSheetOpen}
      />
    </>
  );
}
