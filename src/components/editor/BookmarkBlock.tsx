"use client";
import { useEffect, useState } from "react";

import { DefaultBlockSchema, defaultProps } from "@blocknote/core";
import { ReactSlashMenuItem, createReactBlockSpec } from "@blocknote/react";

import IconBookmark from "assets/icons/icon_bookmark.svg";
import axios from "axios";
import Image from "next/image";

type BookmarkResponse = {
  result: true;
  data: {
    title: string;
    description: string;
    image: string;
  };
};

export const BookmarkBlock = createReactBlockSpec({
  type: "bookmark",
  propSchema: {
    ...defaultProps,
    url: {
      default: "",
    },
    title: {
      default: "",
    },
    description: {
      default: "",
    },
    image: {
      default: "",
    },
    loading: {
      default: "false",
      values: ["true", "false"],
    },
  },
  containsInlineContent: false,
  render: ({ block, editor }) => {
    const [url, setUrl] = useState(block.props.url);

    useEffect(() => {
      if (!block.props.url || block.props.loading === "false") {
        return;
      }

      (async () => {
        try {
          const { data } = await axios.get<BookmarkResponse>(
            `/api/bookmark?target=${url}`
          );

          editor.updateBlock(block, {
            ...block,
            props: {
              url: block.props.url,
              title: data.data.title,
              description: data.data.description,
              image: data.data.image,
              loading: "false",
            },
          });
        } catch (e) {
          console.log(e);
          editor.updateBlock(block, {
            ...block,
            props: {
              url: block.props.url,
              loading: "false",
            },
          });
        }
      })();
    }, [url]);

    if (!block.props.url) {
      return (
        <div
          className="w-full bg-stone-100 flex items-center p-6 relative"
          contentEditable={false}
        >
          <IconBookmark
            className="w-5 h-5 mr-3 fill-gray-600"
            contentEditable={false}
          />
          <p className="text-xl text-gray-600 shrink-0" contentEditable={false}>
            Add an web bookmark
          </p>
          <div className="w-3" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editor.updateBlock(block, {
                  ...block,
                  props: {
                    ...block.props,
                    url,
                    loading: "true",
                  },
                });
              }
            }}
            placeholder="Paste in https://..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      );
    }

    if (block.props.title && block.props.description && block.props.image) {
      return (
        <div
          className="w-full bg-stone-100 flex items-center"
          contentEditable={false}
        >
          <div className="flex-1">
            <p className="text-lg">{block.props.title}</p>
            <p className="text-sm text-gray-500">{block.props.description}</p>
            <p className="text-sm">{block.props.url}</p>
          </div>
          <Image
            alt="Bookmark Opengraph Image"
            src={block.props.image}
            className="w-20 h-10 shrink-0"
          />
        </div>
      );
    }

    return (
      <div className="w-full border border-gray-300" contentEditable={false}>
        <p className="text-lg">Failed to fetch preview</p>
        <p className="text-sm">{block.props.url}</p>
      </div>
    );
  },
});

export const BookmarkCommand = new ReactSlashMenuItem<
  DefaultBlockSchema & { bookmark: typeof BookmarkBlock }
>(
  "Insert Bookmark",
  (editor) => {
    if (editor.getTextCursorPosition().block.content.length === 0) {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "bookmark",
        props: {},
      });
      return;
    }

    editor.insertBlocks(
      [
        {
          type: "bookmark",
          props: {},
        },
      ],
      editor.getTextCursorPosition().block,
      "after"
    );
  },
  ["bookmark", "link", "url", "website"],
  "Media",
  <IconBookmark className="w-5 h-5" />,
  "Insert a web bookmark"
);
