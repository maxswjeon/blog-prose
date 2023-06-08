import { DefaultBlockSchema } from "@blocknote/core";
import {
	InlineContent,
	ReactSlashMenuItem,
	createReactBlockSpec,
} from "@blocknote/react";
import Twemoji from "components/Twemoji";
import Image from "next/image";

import "twemoji";

export const CalloutBlock = createReactBlockSpec({
	type: "callout",
	propSchema: {
		language: {
			default: "plaintext",
		},
	},
	containsInlineContent: true,
	render: () => {
		return (
			<div className="flex bg-stone-100 p-6">
				<div className="w-6 h-6 flex justify-center items-center mr-3">
					<Image
						draggable="false"
						alt="💡"
						src="https://twemoji.maxcdn.com/v/14.0.2/svg/1f4a1.svg"
						width={20}
						height={20}
					/>
				</div>
				<InlineContent className="flex-1" />
			</div>
		);
	},
});

export const CalloutCommand = new ReactSlashMenuItem<
	DefaultBlockSchema & { callout: typeof CalloutBlock }
>(
	"Callout",
	(editor) => {
		if (editor.getTextCursorPosition().block.content.length === 0) {
			editor.updateBlock(editor.getTextCursorPosition().block, {
				type: "callout",
				props: {},
			});
			return;
		}

		editor.insertBlocks(
			[
				{
					type: "callout",
					props: {},
				},
			],
			editor.getTextCursorPosition().block,
			"after",
		);
	},
	["code"],
	"Text",
	<Twemoji emoji="💡" className="w-5 h-5" />,
	"Insert a Code Block",
);
