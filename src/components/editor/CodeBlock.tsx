import { DefaultBlockSchema } from "@blocknote/core";
import {
	InlineContent,
	ReactSlashMenuItem,
	createReactBlockSpec,
} from "@blocknote/react";

import IconCode from "assets/icons/icon_code.svg";

export const CodeBlock = createReactBlockSpec({
	type: "codeblock",
	propSchema: {
		language: {
			default: "plaintext",
		},
	},
	containsInlineContent: true,
	render: ({ block, editor }) => {
		return (
			<div className="relative bg-stone-100 p-6">
				<select
					className="absolute top-6 right-6 text-sm w-[100px] bg-stone-100 focus:outline-none"
					onChange={(e) => {
						editor.updateBlock(block, {
							props: {
								...block.props,
								language: e.target.value,
							},
						});
					}}
				>
					<option className="p-3" value="plaintext">
						Plain Text
					</option>
					<option className="p-3" value="javascript">
						javascript
					</option>
				</select>
				<code className={`language-${block.props.language}`}>
					<InlineContent />
				</code>
			</div>
		);
	},
});

export const CodeCommand = new ReactSlashMenuItem<
	DefaultBlockSchema & { codeblock: typeof CodeBlock }
>(
	"Code",
	(editor) => {
		if (editor.getTextCursorPosition().block.content.length === 0) {
			editor.updateBlock(editor.getTextCursorPosition().block, {
				type: "codeblock",
				props: {},
			});
			return;
		}

		editor.insertBlocks(
			[
				{
					type: "codeblock",
					props: {},
				},
			],
			editor.getTextCursorPosition().block,
			"after",
		);
	},
	["code"],
	"Text",
	<IconCode className="w-5 h-5" />,
	"Insert a Code Block",
);
