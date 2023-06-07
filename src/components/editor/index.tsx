"use client";

import { useRef } from "react";

import {
  BlockNoteView,
  defaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";

import { defaultBlockSchema } from "@blocknote/core";

import { CalloutBlock, CalloutCommand } from "./CalloutBlock";
import { CodeBlock, CodeCommand } from "./CodeBlock";
import { ImageBlock, ImageCommand } from "./ImageBlock";
import { BookmarkBlock, BookmarkCommand } from "./BookmarkBlock";

import useDynamicTextarea from "lib/useDynamicTextarea";

import "@blocknote/core/style.css";

type Props = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  content: string;
  setContent: (content: string) => void;
  save: () => void;
  disabled?: boolean;
};

export default function Editor({
  title,
  setTitle,
  description,
  setDescription,
  content,
  setContent,
  save,
  disabled,
}: Props) {
  const contentEditor = useBlockNote({
    blockSchema: {
      ...defaultBlockSchema,
      image: ImageBlock,
      codeblock: CodeBlock,
      callout: CalloutBlock,
      bookmark: BookmarkBlock,
    },
    slashCommands: [
      ...defaultReactSlashMenuItems,
      ImageCommand,
      CodeCommand,
      CalloutCommand,
      BookmarkCommand,
    ],
    initialContent: JSON.parse(content || "[]"),
    onEditorContentChange: async (editor) => {
      setContent(JSON.stringify(editor.topLevelBlocks));
      console.log(await editor.blocksToHTML(editor.topLevelBlocks));
    },
    editable: !disabled,
  });

  const titleRef = useRef<HTMLTextAreaElement>(null);
  useDynamicTextarea(titleRef.current, title);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  useDynamicTextarea(descriptionRef.current, description);

  return (
    <div className="flex-1 overflow-y-auto">
      <textarea
        ref={titleRef}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onBlur={save}
        value={title}
        placeholder="Untitled"
        className="w-full h-0 text-6xl font-bold leading-snug px-[50px] mt-6 focus:outline-none break-keep whitespace-pre-wrap resize-none placeholder-[#ccc]"
      />
      <textarea
        ref={descriptionRef}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onBlur={save}
        value={description}
        placeholder="Enter description here..."
        className="w-full h-0 text-xl px-[50px] my-3 focus:outline-none break-keep whitespace-pre-wrap resize-none placeholder-[#ccc]"
      />
      <BlockNoteView editor={contentEditor} />
    </div>
  );
}
