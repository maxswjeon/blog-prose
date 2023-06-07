"use client";
import { useRef } from "react";

import { DefaultBlockSchema, defaultProps } from "@blocknote/core";
import {
	InlineContent,
	ReactSlashMenuItem,
	createReactBlockSpec,
} from "@blocknote/react";

import axios from "axios";
import mime from "mime-types";

import IconPicture from "assets/icons/icon_image.svg";

type UploadResponse = {
	result: true;
	data: {
		filename: string;
	};
};

export const ImageBlock = createReactBlockSpec({
	type: "image",
	propSchema: {
		...defaultProps,
		src: {
			default: "",
		},
		caption: {
			default: "",
		},
	},
	containsInlineContent: true, // For the caption
	render: ({ block, editor }) => {
		const inputRef = useRef<HTMLInputElement>(null);

		const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const { data } = await axios.post<UploadResponse>("/api/image", file, {
				withCredentials: true,
				headers: {
					"Content-Type": mime.contentType(file.name),
				},
			});

			editor.updateBlock(block, {
				props: {
					...block.props,
					src: `/images/${data.data.filename}`,
				},
			});
		};

		return (
			<div className="flex flex-col" id={block.id}>
				{block.props.src && (
					<>
						<img
							className="w-full"
							src={block.props.src}
							alt=""
							contentEditable={false}
						/>
					</>
				)}
				{!block.props.src && (
					<div
						className="w-full bg-stone-100 flex items-center p-6"
						contentEditable={false}
						onClick={() => inputRef.current?.click()}
						onKeyDown={() => inputRef.current?.click()}
					>
						<input
							type="file"
							className="hidden"
							ref={inputRef}
							onChange={onSelect}
						/>
						<IconPicture
							className="w-5 h-5 mr-3 fill-gray-600"
							contentEditable={false}
						/>
						<p className="text-xl text-gray-600" contentEditable={false}>
							Add an image
						</p>
					</div>
				)}
				<InlineContent className={block.props.caption ? "block" : "hidden"} />
			</div>
		);
	},
});

export const ImageCommand = new ReactSlashMenuItem<
	DefaultBlockSchema & { image: typeof ImageBlock }
>(
	"Insert Image",
	(editor) => {
		if (editor.getTextCursorPosition().block.content.length === 0) {
			editor.updateBlock(editor.getTextCursorPosition().block, {
				type: "image",
				props: {},
			});
			return;
		}

		editor.insertBlocks(
			[
				{
					type: "image",
					props: {},
				},
			],
			editor.getTextCursorPosition().block,
			"after",
		);
	},
	["image", "img", "picture", "media"],
	"Media",
	<IconPicture className="w-5 h-5" />,
	"Insert an image",
);
